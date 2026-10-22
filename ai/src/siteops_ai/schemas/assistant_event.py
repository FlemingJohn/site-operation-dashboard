from typing import Literal

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from siteops_ai.schemas.card import Card
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.schemas.source import Source


class AssistantEvent(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    type: Literal["thinking", "step", "text", "ui", "done", "error"]
    label: str | None = None
    text: str | None = None
    message: str | None = None
    card: Card | None = None
    records: list[RecordLink] | None = None
    sources: list[Source] | None = None

    def to_line(self) -> str:
        return self.model_dump_json(exclude_none=True, by_alias=True) + "\n"
