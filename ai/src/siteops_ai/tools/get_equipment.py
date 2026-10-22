from typing import Annotated

from agents import function_tool
from pydantic import Field

from siteops_ai.backend.find_machine import find_machine
from siteops_ai.backend.get_json import get_json
from siteops_ai.backend.models.machine_detail import MachineDetail
from siteops_ai.schemas.page_path import PagePath
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.tools.tool_context import ToolContext

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
    machine, matches = await find_machine(backend, serial)
    if not machine:
        return {
            "error": "No single machine matches that serial.",
            "machines": [unit.to_tool_result() for unit in matches],
        }

    unit = await get_json(backend, f"/equipment/{machine.id}", MachineDetail)
    context.context.remember(
        "get_equipment",
        f"Opened {unit.serial}",
        [RecordLink(label=unit.serial, path=PagePath.machine(unit.id))],
    )
    return unit.to_tool_result() | {"serviceRecords": unit.service_records[:HISTORY_LIMIT]}
