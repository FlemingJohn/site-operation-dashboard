from typing import Annotated

from agents import function_tool
from pydantic import Field

from siteops_ai.backend.get_json import get_json
from siteops_ai.backend.models.installation import Installation
from siteops_ai.backend.models.page import Page
from siteops_ai.choices.installation_status import InstallationStatus
from siteops_ai.schemas.page_path import PagePath
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.settings import get_settings
from siteops_ai.tools.tool_context import ToolContext


@function_tool(
    description_override=(
        "List installations, newest first, filtered by status, site id, or a search on "
        "equipment or technician name."
    )
)
async def list_installations(
    context: ToolContext,
    search: Annotated[str | None, Field(description="Part of the equipment or technician name")],
    status: InstallationStatus | None,
    site_id: Annotated[int | None, Field(description="Site id from search_sites")],
) -> dict:
    page = await get_json(
        context.context.backend,
        "/installations",
        Page[Installation],
        search=search,
        status=status,
        siteId=site_id,
        limit=get_settings().tool_result_limit,
    )
    total = page.pagination.total
    context.context.remember(
        "list_installations",
        f"Found {total} installations",
        [RecordLink(label=item.site_name, path=PagePath.site(item.site_id)) for item in page.data],
    )
    return {"total": total, "installations": [item.to_tool_result() for item in page.data]}
