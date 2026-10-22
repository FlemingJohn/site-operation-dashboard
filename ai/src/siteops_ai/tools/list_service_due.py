from typing import Annotated, Literal

from agents import function_tool
from pydantic import Field

from siteops_ai.backend.get_json import get_json
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.tools.tool_context import ToolContext

RESULT_LIMIT = 20


@function_tool(
    description_override=(
        "Machines ordered by next check-up date, soonest first. state: late = overdue, "
        "this_week = due in the next 7 days, later = further ahead."
    )
)
async def list_service_due(
    context: ToolContext,
    state: Literal["late", "this_week", "later"] | None,
    search: Annotated[str | None, Field(description="Part of a serial number or site name")],
) -> dict:
    result = await get_json(
        context.context.backend, "/equipment", state=state, search=search, limit=RESULT_LIMIT
    )
    machines = result["data"]
    total = result["pagination"]["total"]
    context.context.remember(
        "list_service_due",
        f"Looked at {total} machines",
        [RecordLink(label=unit["serial"], path=f"/equipment/{unit['id']}") for unit in machines],
    )
    return {"total": total, "machines": machines}
