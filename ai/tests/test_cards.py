import json

import respx
from agents.tool_context import ToolContext

from siteops_ai.agent.answer_context import AnswerContext
from siteops_ai.backend.create_backend_client import create_backend_client
from siteops_ai.schemas.assistant_event import AssistantEvent
from siteops_ai.schemas.card import Card
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.tools.list_low_stock_parts import list_low_stock_parts
from siteops_ai.tools.list_service_due import list_service_due

API = "http://backend.test/api"


async def invoke(tool, context: AnswerContext, arguments: dict):
    text = json.dumps(arguments)
    tool_context = ToolContext(
        context=context, tool_name=tool.name, tool_call_id="call_1", tool_arguments=text
    )
    return await tool.on_invoke_tool(tool_context, text)


def machine(number: int) -> dict:
    return {
        "id": number,
        "serial": f"BY-{number}",
        "type": "blade_yoke",
        "siteName": "Chennai Plant",
        "nextServiceOn": "2026-10-03",
        "serviceState": "late",
        "lastServiceBy": "Ravi Kumar",
    }


@respx.mock
async def test_machine_cards_stop_at_five_and_keep_the_real_total():
    respx.get(f"{API}/equipment").respond(
        json={"data": [machine(n) for n in range(1, 8)], "pagination": {"total": 17}}
    )
    async with create_backend_client() as backend:
        context = AnswerContext(backend=backend)
        result = await invoke(list_service_due, context, {"state": "late", "search": None})

    card = context.card
    assert card.component == "machineCards"
    assert len(card.props["machines"]) == 5
    assert card.total == 17
    assert card.see_all.path == "/service"
    assert "lastServiceBy" not in card.props["machines"][0]
    assert result["shownAsCards"] == 5


@respx.mock
async def test_no_card_when_nothing_matches():
    respx.get(f"{API}/equipment").respond(json={"data": [], "pagination": {"total": 0}})
    async with create_backend_client() as backend:
        context = AnswerContext(backend=backend)
        await invoke(list_service_due, context, {"state": "late", "search": None})

    assert context.card is None


@respx.mock
async def test_low_stock_rows_skip_parts_with_enough_stock():
    parts = [
        {
            "id": 1,
            "name": "Clamp pad",
            "stock": 0,
            "reorderAt": 4,
            "capacity": 16,
            "stockLevel": "out",
        },
        {
            "id": 2,
            "name": "Sling",
            "stock": 22,
            "reorderAt": 6,
            "capacity": 30,
            "stockLevel": "stocked",
        },
    ]
    respx.get(f"{API}/spare-parts").respond(json={"data": parts, "pagination": {"total": 2}})
    respx.get(f"{API}/part-requests").respond(json={"data": [], "pagination": {"total": 0}})
    async with create_backend_client() as backend:
        context = AnswerContext(backend=backend)
        await invoke(list_low_stock_parts, context, {})

    assert [part["name"] for part in context.card.props["parts"]] == ["Clamp pad"]
    assert context.card.total == 1


def test_only_the_first_card_of_an_answer_is_kept():
    context = AnswerContext(backend=None)
    assert context.show(Card(component="stockRows", props={"parts": []}))
    assert not context.show(Card(component="machineCards", props={"machines": []}))
    assert context.card.component == "stockRows"


def test_a_form_takes_the_place_of_cards():
    context = AnswerContext(backend=None)
    context.show(Card(component="stockRows", props={"parts": []}))
    assert context.show(Card(component="reorderPart", props={}))
    assert not context.show(Card(component="confirmMove", props={}))
    assert context.card.component == "reorderPart"


def test_ui_event_is_sent_in_camel_case():
    card = Card(
        component="machineCards",
        props={"machines": []},
        total=17,
        see_all=RecordLink(label="Service", path="/service"),
    )
    line = json.loads(AssistantEvent(type="ui", card=card).to_line())
    assert line == {
        "type": "ui",
        "card": {
            "component": "machineCards",
            "props": {"machines": []},
            "total": 17,
            "seeAll": {"label": "Service", "path": "/service"},
        },
    }
