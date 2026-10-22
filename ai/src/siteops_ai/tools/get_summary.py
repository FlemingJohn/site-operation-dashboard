from agents import function_tool

from siteops_ai.backend.get_json import get_json
from siteops_ai.backend.models.summary import Summary
from siteops_ai.schemas.page_path import PagePath
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.tools.tool_context import ToolContext


@function_tool(
    description_override=(
        "Overall totals: number of sites and active sites, installations by status, "
        "and installations per month."
    )
)
async def get_summary(context: ToolContext) -> dict:
    summary = await get_json(context.context.backend, "/summary", Summary)
    context.context.remember(
        "get_summary",
        "Read the overview totals",
        [RecordLink(label="Overview", path=PagePath.OVERVIEW)],
    )
    return summary.model_dump(by_alias=True, exclude={"installations_by_technician"})
