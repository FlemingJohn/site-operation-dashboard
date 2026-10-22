from typing import Annotated, Literal

from agents import function_tool
from pydantic import Field

from siteops_ai.backend.get_json import get_json
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.tools.tool_context import ToolContext

RESULT_LIMIT = 20


@function_tool(
    description_override=(
        "List installations, newest first, filtered by status, site id, or a search on "
        "equipment or technician name."
    )
)
async def list_installations(
    context: ToolContext,
    search: Annotated[str | None, Field(description="Part of the equipment or technician name")],
    status: Literal["pending", "in_progress", "completed"] | None,
    site_id: Annotated[int | None, Field(description="Site id from search_sites")],
) -> dict:
    result = await get_json(
        context.context.backend,
        "/installations",
        search=search,
        status=status,
        siteId=site_id,
        limit=RESULT_LIMIT,
    )
    installations = result["data"]
    total = result["pagination"]["total"]
    context.context.remember(
        "list_installations",
        f"Found {total} installations",
        [
            RecordLink(label=item["siteName"], path=f"/sites/{item['siteId']}")
            for item in installations
        ],
    )
    return {"total": total, "installations": installations}
