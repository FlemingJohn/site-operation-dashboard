import asyncio

from agents import function_tool

from siteops_ai.backend.get_json import get_json
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.tools.tool_context import ToolContext

LIST_LIMIT = 100
OPEN_STATUSES = ("requested", "ordered")


@function_tool(
    description_override=(
        "Spare parts that are out of stock or at or below their reorder level, lowest first, "
        "with any open requests for them."
    )
)
async def list_low_stock_parts(context: ToolContext) -> dict:
    backend = context.context.backend
    parts, *open_results = await asyncio.gather(
        get_json(backend, "/spare-parts", limit=LIST_LIMIT),
        *(get_json(backend, "/part-requests", status=s, limit=LIST_LIMIT) for s in OPEN_STATUSES),
    )
    open_requests = [request for result in open_results for request in result["data"]]
    low_parts = [
        {
            **part,
            "openRequests": [req for req in open_requests if req["partId"] == part["id"]],
        }
        for part in parts["data"]
        if part["stockLevel"] != "stocked"
    ]
    context.context.remember(
        "list_low_stock_parts",
        f"Found {len(low_parts)} parts running low",
        [RecordLink(label="Spare parts", path="/spare-parts")] if low_parts else [],
    )
    return {"lowParts": low_parts}
