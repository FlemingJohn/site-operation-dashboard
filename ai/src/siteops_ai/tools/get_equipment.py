from typing import Annotated

from agents import function_tool
from pydantic import Field

from siteops_ai.backend.get_json import get_json
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.tools.tool_context import ToolContext

MATCH_LIMIT = 5
HISTORY_LIMIT = 5


@function_tool(
    description_override=(
        "One machine by serial number, such as BY-204, with its site, next check-up, "
        "recent check-ups and parts asked for."
    )
)
async def get_equipment(
    context: ToolContext,
    serial: Annotated[str, Field(min_length=1, description="Serial number, such as BY-204")],
) -> dict:
    backend = context.context.backend
    matches = (await get_json(backend, "/equipment", search=serial, limit=MATCH_LIMIT))["data"]
    exact = [unit for unit in matches if unit["serial"].lower() == serial.lower()]
    chosen = exact or (matches if len(matches) == 1 else [])
    if not chosen:
        return {"error": "No single machine matches that serial.", "machines": matches}

    unit = await get_json(backend, f"/equipment/{chosen[0]['id']}")
    context.context.remember(
        "get_equipment",
        f"Opened {unit['serial']}",
        [RecordLink(label=unit["serial"], path=f"/equipment/{unit['id']}")],
    )
    return {**unit, "serviceRecords": unit["serviceRecords"][:HISTORY_LIMIT]}
