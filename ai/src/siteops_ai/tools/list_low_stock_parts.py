import asyncio

from agents import function_tool

from siteops_ai.backend.get_json import get_json
from siteops_ai.backend.models.page import Page
from siteops_ai.backend.models.part_request import PartRequest
from siteops_ai.backend.models.spare_part import SparePart
from siteops_ai.choices.open_request_statuses import OPEN_REQUEST_STATUSES
from siteops_ai.schemas.page_path import PagePath
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.tools.tool_context import ToolContext

LIST_LIMIT = 100


@function_tool(
    description_override=(
        "Spare parts that are out of stock or at or below their reorder level, lowest first, "
        "with any open requests for them."
    )
)
async def list_low_stock_parts(context: ToolContext) -> dict:
    backend = context.context.backend
    parts, *open_pages = await asyncio.gather(
        get_json(backend, "/spare-parts", Page[SparePart], limit=LIST_LIMIT),
        *(
            get_json(backend, "/part-requests", Page[PartRequest], status=status, limit=LIST_LIMIT)
            for status in OPEN_REQUEST_STATUSES
        ),
    )
    open_requests = [request for page in open_pages for request in page.data]
    low_parts = [
        part.to_tool_result()
        | {
            "openRequests": [
                request.to_tool_result() for request in open_requests if request.part_id == part.id
            ]
        }
        for part in parts.data
        if part.stock_level != "stocked"
    ]
    context.context.remember(
        "list_low_stock_parts",
        f"Found {len(low_parts)} parts running low",
        [RecordLink(label="Spare parts", path=PagePath.SPARE_PARTS)] if low_parts else [],
    )
    return {"lowParts": low_parts}
