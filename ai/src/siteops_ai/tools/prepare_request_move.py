from typing import Annotated

from agents import function_tool
from pydantic import Field

from siteops_ai.backend.find_part import find_part
from siteops_ai.backend.get_json import get_json
from siteops_ai.backend.models.page import Page
from siteops_ai.backend.models.part_request import PartRequest
from siteops_ai.choices.next_request_status import NextRequestStatus
from siteops_ai.choices.previous_request_status import PREVIOUS_REQUEST_STATUS
from siteops_ai.schemas.card import Card
from siteops_ai.schemas.page_path import PagePath
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.settings import get_settings
from siteops_ai.tools.tool_context import ToolContext


@function_tool(
    description_override=(
        "Prepare moving one part request forward, to ordered or to delivered, as a card the "
        "person confirms. It never moves anything."
    )
)
async def prepare_request_move(
    context: ToolContext,
    part_name: Annotated[str, Field(min_length=1, description="Part name, as the person said")],
    to_status: NextRequestStatus,
    serial: Annotated[str | None, Field(description="Machine serial, when the person gave one")],
) -> dict:
    backend = context.context.backend
    from_status = PREVIOUS_REQUEST_STATUS[to_status]
    page = await get_json(
        backend,
        "/part-requests",
        Page[PartRequest],
        status=from_status,
        search=part_name,
        limit=get_settings().tool_result_limit,
    )
    requests = [r for r in page.data if not serial or (r.serial or "").lower() == serial.lower()]
    if len(requests) != 1:
        return {
            "error": f"Found {len(requests)} matching {from_status} requests. Ask which one.",
            "requests": [r.to_tool_result() for r in requests],
        }

    request = requests[0]
    stock = await stock_change(backend, request) if to_status == "delivered" else {}
    is_form_shown = context.context.show(
        Card(
            component="confirmMove",
            props={
                "request": {
                    "id": request.id,
                    "partName": request.part_name,
                    "quantity": request.quantity,
                    "serial": request.serial,
                },
                "fromStatus": from_status,
                "toStatus": to_status,
                **stock,
            },
        )
    )
    context.context.remember(
        "prepare_request_move",
        f"Prepared moving {request.part_name} to {to_status}",
        [RecordLink(label="Spare parts", path=PagePath.SPARE_PARTS)],
    )
    return {
        "prepared": "confirm card",
        "request": request.part_name,
        "formShown": is_form_shown,
        "movedYet": False,
    }


async def stock_change(backend, request: PartRequest) -> dict:
    part, _ = await find_part(backend, request.part_name)
    if not part:
        return {}
    return {
        "stockBefore": part.stock,
        "stockAfter": min(part.stock + request.quantity, part.capacity),
    }
