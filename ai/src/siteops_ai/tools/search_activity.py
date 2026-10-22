from typing import Annotated, Literal

from agents import function_tool
from pydantic import Field

from siteops_ai.backend.get_json import get_json
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.tools.tool_context import ToolContext

RESULT_LIMIT = 20


def to_sentence(event: dict) -> str:
    words = [event["actorName"] or "Someone", event["verb"], event["target"]["label"]]
    return " ".join([*words, event["after"]] if event["after"] else words)


@function_tool(
    description_override=(
        "Recent changes, newest first: who did what and when. Filter by a search on person, "
        "machine, site or note, by kind, or to the last 7 or 30 days."
    )
)
async def search_activity(
    context: ToolContext,
    search: Annotated[str | None, Field(description="Person, machine, site or note text")],
    kind: Literal["installation", "service", "part", "site", "user"] | None,
    days: Literal["7", "30"] | None,
) -> dict:
    result = await get_json(
        context.context.backend,
        "/activity",
        search=search,
        kind=kind,
        days=days,
        limit=RESULT_LIMIT,
    )
    events = result["data"]
    context.context.remember(
        "search_activity",
        f"Read {len(events)} changes",
        [RecordLink(label=e["target"]["label"], path=e["target"]["path"]) for e in events],
    )
    return {
        "total": result["pagination"]["total"],
        "events": [
            {"occurredAt": e["occurredAt"], "sentence": to_sentence(e), "note": e["note"]}
            for e in events
        ],
    }
