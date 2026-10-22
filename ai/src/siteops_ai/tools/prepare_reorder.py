from typing import Annotated

from agents import function_tool
from pydantic import Field

from siteops_ai.backend.find_part import find_part
from siteops_ai.backend.find_technician import find_technician
from siteops_ai.schemas.card import Card
from siteops_ai.schemas.page_path import PagePath
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.tools.tool_context import ToolContext


@function_tool(
    description_override=(
        "Prepare a spare part reorder as a form the person checks and sends. It never sends "
        "anything. Leave a value empty when the person did not give it."
    )
)
async def prepare_reorder(
    context: ToolContext,
    part_name: Annotated[str, Field(min_length=1, description="Part name, as the person said")],
    quantity: Annotated[int | None, Field(ge=1, le=1000, description="How many to order")],
    requested_by: Annotated[str | None, Field(description="Who is asking, as the person said")],
) -> dict:
    backend = context.context.backend
    part, matches = await find_part(backend, part_name)
    if not part:
        return {
            "error": "No single part matches that name. Ask which one.",
            "parts": [candidate.name for candidate in matches],
        }

    technician = await find_technician(backend, requested_by)
    is_form_shown = context.context.show(
        Card(
            component="reorderPart",
            props={
                "part": {
                    "id": part.id,
                    "name": part.name,
                    "stock": part.stock,
                    "capacity": part.capacity,
                },
                "quantity": quantity or max(part.capacity - part.stock, 1),
                "requestedBy": technician.id if technician else None,
            },
        )
    )
    context.context.remember(
        "prepare_reorder",
        f"Prepared a reorder of {part.name}",
        [RecordLink(label="Spare parts", path=PagePath.SPARE_PARTS)],
    )
    return {
        "prepared": "reorder form",
        "part": part.name,
        "stock": part.stock,
        "formShown": is_form_shown,
        "sentYet": False,
    }
