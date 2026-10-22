import json

import respx
from agents.tool_context import ToolContext

from siteops_ai.agent.answer_context import AnswerContext
from siteops_ai.backend.create_backend_client import create_backend_client
from siteops_ai.tools.prepare_reorder import prepare_reorder
from siteops_ai.tools.prepare_request_move import prepare_request_move
from siteops_ai.tools.prepare_service_done import prepare_service_done

API = "http://backend.test/api"
MACHINE = {"id": 3, "serial": "BY-204", "type": "blade_yoke", "siteName": "Chennai Plant"}
TECHNICIANS = [{"id": 2, "fullName": "Ravi Kumar"}, {"id": 4, "fullName": "Mohan Rao"}]
PART = {"id": 1, "name": "Hydraulic pin set", "stock": 8, "capacity": 30, "stockLevel": "low"}


async def invoke(tool, context: AnswerContext, arguments: dict):
    text = json.dumps(arguments)
    tool_context = ToolContext(
        context=context, tool_name=tool.name, tool_call_id="call_1", tool_arguments=text
    )
    return await tool.on_invoke_tool(tool_context, text)


def page(items: list) -> dict:
    return {"data": items, "pagination": {"total": len(items)}}


@respx.mock
async def test_check_up_form_is_filled_from_the_question_and_never_saves():
    respx.get(f"{API}/equipment").respond(json=page([MACHINE]))
    respx.get(f"{API}/users").respond(json=page(TECHNICIANS))
    writes = respx.route(method__in=["POST", "PUT", "PATCH", "DELETE"]).respond(500)
    async with create_backend_client() as backend:
        context = AnswerContext(backend=backend)
        result = await invoke(
            prepare_service_done,
            context,
            {
                "serial": "by-204",
                "done_on": "2026-10-20",
                "technician_name": "ravi",
                "notes": "Pads",
            },
        )

    assert context.card.component == "markServiceDone"
    assert context.card.props == {
        "machine": MACHINE,
        "doneOn": "2026-10-20",
        "technicianId": 2,
        "notes": "Pads",
    }
    assert result["savedYet"] is False
    assert not writes.called


@respx.mock
async def test_check_up_in_the_future_is_refused():
    respx.get(f"{API}/equipment").respond(json=page([MACHINE]))
    async with create_backend_client() as backend:
        context = AnswerContext(backend=backend)
        result = await invoke(
            prepare_service_done,
            context,
            {"serial": "BY-204", "done_on": "2099-01-01", "technician_name": None, "notes": None},
        )

    assert "future" in result["error"]
    assert context.card is None


@respx.mock
async def test_unclear_machine_asks_which_one():
    respx.get(f"{API}/equipment").respond(
        json=page([{**MACHINE, "serial": "BY-2041"}, {**MACHINE, "id": 4, "serial": "BY-2042"}])
    )
    async with create_backend_client() as backend:
        context = AnswerContext(backend=backend)
        result = await invoke(
            prepare_service_done,
            context,
            {"serial": "BY-20", "done_on": None, "technician_name": None, "notes": None},
        )

    assert result["machines"] == ["BY-2041", "BY-2042"]
    assert context.card is None


@respx.mock
async def test_reorder_defaults_to_filling_the_shelf_when_no_quantity_is_given():
    respx.get(f"{API}/spare-parts").respond(json=page([PART]))
    async with create_backend_client() as backend:
        context = AnswerContext(backend=backend)
        await invoke(
            prepare_reorder,
            context,
            {"part_name": "hydraulic pin set", "quantity": None, "requested_by": None},
        )

    assert context.card.props["quantity"] == 22
    assert context.card.props["requestedBy"] is None


@respx.mock
async def test_delivery_card_shows_the_stock_change_capped_at_capacity():
    request = {
        "id": 7,
        "partId": 1,
        "partName": "Hydraulic pin set",
        "quantity": 30,
        "serial": "BY-204",
    }
    route = respx.get(f"{API}/part-requests").respond(json=page([request]))
    respx.get(f"{API}/spare-parts").respond(json=page([PART]))
    async with create_backend_client() as backend:
        context = AnswerContext(backend=backend)
        await invoke(
            prepare_request_move,
            context,
            {"part_name": "pin set", "to_status": "delivered", "serial": "BY-204"},
        )

    assert route.calls.last.request.url.params["status"] == "ordered"
    assert context.card.props["stockBefore"] == 8
    assert context.card.props["stockAfter"] == 30
    assert context.card.props["toStatus"] == "delivered"


@respx.mock
async def test_two_matching_requests_ask_which_one():
    request = {"id": 7, "partId": 1, "partName": "Pin set", "quantity": 2, "serial": None}
    respx.get(f"{API}/part-requests").respond(json=page([request, {**request, "id": 8}]))
    async with create_backend_client() as backend:
        context = AnswerContext(backend=backend)
        result = await invoke(
            prepare_request_move,
            context,
            {"part_name": "pin set", "to_status": "ordered", "serial": None},
        )

    assert "Ask which one" in result["error"]
    assert context.card is None


@respx.mock
async def test_a_plural_part_name_still_finds_the_part():
    clamp_pad = {**PART, "id": 4, "name": "Clamp pad for blade yoke", "stock": 0, "capacity": 16}
    route = respx.get(f"{API}/spare-parts")
    route.side_effect = [
        respx.MockResponse(json=page([])),
        respx.MockResponse(json=page([clamp_pad])),
    ]
    async with create_backend_client() as backend:
        context = AnswerContext(backend=backend)
        await invoke(
            prepare_reorder,
            context,
            {"part_name": "clamp pads", "quantity": None, "requested_by": None},
        )

    assert [call.request.url.params["search"] for call in route.calls] == [
        "clamp pads",
        "clamp pad",
    ]
    assert context.card.props["part"]["name"] == "Clamp pad for blade yoke"
