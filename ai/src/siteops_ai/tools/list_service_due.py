from typing import Annotated

from agents import function_tool
from pydantic import Field

from siteops_ai.backend.get_json import get_json
from siteops_ai.backend.models.machine import Machine
from siteops_ai.backend.models.page import Page
from siteops_ai.choices.service_state import ServiceState
from siteops_ai.schemas.page_path import PagePath
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.settings import get_settings
from siteops_ai.tools.tool_context import ToolContext


@function_tool(
    description_override=(
        "Machines ordered by next check-up date, soonest first. state: late = overdue, "
        "this_week = due in the next 7 days, later = further ahead."
    )
)
async def list_service_due(
    context: ToolContext,
    state: ServiceState | None,
    search: Annotated[str | None, Field(description="Part of a serial number or site name")],
) -> dict:
    page = await get_json(
        context.context.backend,
        "/equipment",
        Page[Machine],
        state=state,
        search=search,
        limit=get_settings().tool_result_limit,
    )
    total = page.pagination.total
    context.context.remember(
        "list_service_due",
        f"Looked at {total} machines",
        [RecordLink(label=unit.serial, path=PagePath.machine(unit.id)) for unit in page.data],
    )
    return {"total": total, "machines": [unit.to_tool_result() for unit in page.data]}
