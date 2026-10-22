from agents import function_tool

from siteops_ai.backend.get_json import get_json
from siteops_ai.backend.models.summary import Summary
from siteops_ai.schemas.page_path import PagePath
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.tools.tool_context import ToolContext


@function_tool(
    description_override=(
        "Installations per technician. open = pending + in progress, the work still to do. "
        "completed is finished work. Sorted by most open work first. mostOpen lists everyone "
        "tied for the most open work."
    )
)
async def get_technician_workload(context: ToolContext) -> dict:
    summary = await get_json(context.context.backend, "/summary", Summary)
    technicians = sorted(
        (
            {
                "technician": row.label,
                "open": row.pending + row.in_progress,
                "pending": row.pending,
                "inProgress": row.in_progress,
                "completed": row.completed,
            }
            for row in summary.installations_by_technician
        ),
        key=lambda row: row["open"],
        reverse=True,
    )
    context.context.remember(
        "get_technician_workload",
        f"Looked at {len(technicians)} technicians",
        [RecordLink(label="Installations", path=PagePath.INSTALLATIONS)],
    )
    highest = technicians[0]["open"] if technicians else 0
    most_open = [row["technician"] for row in technicians if highest and row["open"] == highest]
    return {"mostOpen": most_open, "technicians": technicians}
