from typing import Annotated, Literal

from agents import function_tool
from pydantic import Field

from siteops_ai.backend.get_json import get_json
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.tools.tool_context import ToolContext

RESULT_LIMIT = 20


@function_tool(
    description_override=(
        "Find sites by name or city, status or region. Returns each site with its city, "
        "region, status and installation count."
    )
)
async def search_sites(
    context: ToolContext,
    search: Annotated[str | None, Field(description="Part of a site name or city")],
    status: Literal["active", "inactive"] | None,
    region: Literal["North", "South", "East", "West"] | None,
) -> dict:
    result = await get_json(
        context.context.backend,
        "/sites",
        search=search,
        status=status,
        region=region,
        limit=RESULT_LIMIT,
    )
    sites = result["data"]
    total = result["pagination"]["total"]
    context.context.remember(
        "search_sites",
        f"Found {total} sites",
        [RecordLink(label=site["name"], path=f"/sites/{site['id']}") for site in sites],
    )
    return {"total": total, "sites": sites}
