from typing import Annotated

from agents import function_tool
from pydantic import Field

from siteops_ai.backend.get_json import get_json
from siteops_ai.backend.models.machine import Machine
from siteops_ai.backend.models.page import Page
from siteops_ai.choices.service_state import ServiceState
from siteops_ai.schemas.card import Card
from siteops_ai.schemas.page_path import PagePath
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.settings import get_settings
from siteops_ai.tools.tool_context import ToolContext

CARD_FIELDS = ("id", "serial", "type", "siteName", "nextServiceOn", "serviceState")


@function_tool(
    description_override=(
        "Machines ordered by next check-up date, soonest first, overdue ones at the top. "
        "state: late = overdue, this_week = due in the next 7 days, later = further ahead. "
        "Leave state empty for every machine. Shows them as cards."
    )
)
async def list_service_due(
    context: ToolContext,
    state: ServiceState | None,
    search: Annotated[str | None, Field(description="Part of a serial number or site name")],
) -> dict:
    settings = get_settings()
    page = await get_json(
        context.context.backend,
        "/equipment",
        Page[Machine],
        state=state,
        search=search,
        limit=settings.tool_result_limit,
    )
    total = page.pagination.total
    machines = [unit.to_tool_result() for unit in page.data]
    context.context.remember(
        "list_service_due",
        f"Looked at {total} machines",
        [RecordLink(label=unit.serial, path=PagePath.machine(unit.id)) for unit in page.data],
    )
    is_shown = bool(machines) and context.context.show(
        Card(
            component="machineCards",
            props={
                "machines": [
                    {key: unit.get(key) for key in CARD_FIELDS}
                    for unit in machines[: settings.max_cards]
                ]
            },
            total=total,
            see_all=RecordLink(label="Service", path=PagePath.SERVICE),
        )
    )
    shown_count = min(total, settings.max_cards) if is_shown else 0
    return {"total": total, "shownAsCards": shown_count, "machines": machines}
