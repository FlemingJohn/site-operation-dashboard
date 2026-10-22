from typing import Annotated

from agents import function_tool
from pydantic import Field

from siteops_ai.backend.get_json import get_json
from siteops_ai.backend.models.activity_event import ActivityEvent
from siteops_ai.backend.models.page import Page
from siteops_ai.choices.activity_kind import ActivityKind
from siteops_ai.choices.activity_period import ActivityPeriod
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.settings import get_settings
from siteops_ai.tools.tool_context import ToolContext


def to_sentence(event: ActivityEvent) -> str:
    words = [event.actor_name or "Someone", event.verb, event.target.label]
    return " ".join([*words, event.after] if event.after else words)


@function_tool(
    description_override=(
        "Recent changes, newest first: who did what and when. Filter by a search on person, "
        "machine, site or note, by kind, or to the last 7 or 30 days."
    )
)
async def search_activity(
    context: ToolContext,
    search: Annotated[str | None, Field(description="Person, machine, site or note text")],
    kind: ActivityKind | None,
    days: ActivityPeriod | None,
) -> dict:
    page = await get_json(
        context.context.backend,
        "/activity",
        Page[ActivityEvent],
        search=search,
        kind=kind,
        days=days,
        limit=get_settings().tool_result_limit,
    )
    context.context.remember(
        "search_activity",
        f"Read {len(page.data)} changes",
        [RecordLink(label=event.target.label, path=event.target.path) for event in page.data],
    )
    return {
        "total": page.pagination.total,
        "events": [
            {"occurredAt": event.occurred_at, "sentence": to_sentence(event), "note": event.note}
            for event in page.data
        ],
    }
