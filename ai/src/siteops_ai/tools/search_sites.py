from typing import Annotated

from agents import function_tool
from pydantic import Field

from siteops_ai.backend.get_json import get_json
from siteops_ai.backend.models.page import Page
from siteops_ai.backend.models.site import Site
from siteops_ai.choices.region import Region
from siteops_ai.choices.site_status import SiteStatus
from siteops_ai.schemas.page_path import PagePath
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.settings import get_settings
from siteops_ai.tools.tool_context import ToolContext


@function_tool(
    description_override=(
        "Find sites by name or city, status or region. Returns each site with its city, "
        "region, status and installation count."
    )
)
async def search_sites(
    context: ToolContext,
    search: Annotated[str | None, Field(description="Part of a site name or city")],
    status: SiteStatus | None,
    region: Region | None,
) -> dict:
    page = await get_json(
        context.context.backend,
        "/sites",
        Page[Site],
        search=search,
        status=status,
        region=region,
        limit=get_settings().tool_result_limit,
    )
    total = page.pagination.total
    context.context.remember(
        "search_sites",
        f"Found {total} sites",
        [RecordLink(label=site.name, path=PagePath.site(site.id)) for site in page.data],
    )
    return {"total": total, "sites": [site.to_tool_result() for site in page.data]}
