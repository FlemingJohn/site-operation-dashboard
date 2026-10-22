import json

import httpx
import respx
from agents.tool_context import ToolContext

from siteops_ai.agent.answer_context import AnswerContext
from siteops_ai.backend.create_backend_client import create_backend_client
from siteops_ai.tools.get_equipment import get_equipment
from siteops_ai.tools.get_technician_workload import get_technician_workload
from siteops_ai.tools.list_service_due import list_service_due
from siteops_ai.tools.search_activity import search_activity

API = "http://backend.test/api"


async def invoke(tool, context: AnswerContext, arguments: dict):
    text = json.dumps(arguments)
    tool_context = ToolContext(
        context=context, tool_name=tool.name, tool_call_id="call_1", tool_arguments=text
    )
    return await tool.on_invoke_tool(tool_context, text)


@respx.mock
async def test_workload_reports_every_technician_tied_for_most_open_work():
    rows = [
        {"label": "Ravi", "pending": 0, "inProgress": 1, "completed": 3},
        {"label": "Alan", "pending": 1, "inProgress": 0, "completed": 0},
        {"label": "Priya", "pending": 0, "inProgress": 0, "completed": 2},
    ]
    respx.get(f"{API}/summary").respond(json={"installationsByTechnician": rows})
    async with create_backend_client() as backend:
        context = AnswerContext(backend=backend)
        result = await invoke(get_technician_workload, context, {})

    assert result["mostOpen"] == ["Ravi", "Alan"]
    assert [row["open"] for row in result["technicians"]] == [1, 1, 0]
    assert context.sources[0].tool == "get_technician_workload"


@respx.mock
async def test_service_due_sends_the_state_and_the_service_key():
    route = respx.get(f"{API}/equipment").respond(
        json={"data": [{"id": 3, "serial": "BY-204"}], "pagination": {"total": 1}}
    )
    async with create_backend_client() as backend:
        context = AnswerContext(backend=backend)
        result = await invoke(list_service_due, context, {"state": "late", "search": None})

    request = route.calls.last.request
    assert request.url.params["state"] == "late"
    assert "search" not in request.url.params
    assert request.headers["X-Service-Key"] == "s" * 40
    assert result["total"] == 1
    assert context.records[0].path == "/equipment/3"


@respx.mock
async def test_equipment_opens_the_exact_serial_match():
    respx.get(f"{API}/equipment").respond(
        json={"data": [{"id": 3, "serial": "BY-204"}, {"id": 4, "serial": "BY-2041"}]}
    )
    respx.get(f"{API}/equipment/3").respond(
        json={"id": 3, "serial": "BY-204", "serviceRecords": [{"id": n} for n in range(8)]}
    )
    async with create_backend_client() as backend:
        context = AnswerContext(backend=backend)
        result = await invoke(get_equipment, context, {"serial": "by-204"})

    assert result["serial"] == "BY-204"
    assert len(result["serviceRecords"]) == 5


@respx.mock
async def test_activity_is_turned_into_sentences():
    event = {
        "occurredAt": "2026-10-22T09:00:00Z",
        "actorName": None,
        "verb": "set",
        "target": {"label": "Kochi Port Yard", "path": "/sites/5"},
        "after": "to Inactive",
        "note": None,
    }
    respx.get(f"{API}/activity").respond(json={"data": [event], "pagination": {"total": 1}})
    async with create_backend_client() as backend:
        context = AnswerContext(backend=backend)
        result = await invoke(search_activity, context, {"search": None, "kind": None, "days": "7"})

    assert result["events"][0]["sentence"] == "Someone set Kochi Port Yard to Inactive"


@respx.mock
async def test_a_failing_backend_becomes_a_message_for_the_model():
    respx.get(f"{API}/summary").mock(side_effect=httpx.ConnectError("down"))
    async with create_backend_client() as backend:
        context = AnswerContext(backend=backend)
        result = await invoke(get_technician_workload, context, {})

    assert isinstance(result, str)
    assert context.sources == []
