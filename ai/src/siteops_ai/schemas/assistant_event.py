from typing import Literal

from pydantic import BaseModel

from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.schemas.source import Source


class AssistantEvent(BaseModel):
    type: Literal["thinking", "step", "text", "done", "error"]
    label: str | None = None
    text: str | None = None
    message: str | None = None
    records: list[RecordLink] | None = None
    sources: list[Source] | None = None

    def to_line(self) -> str:
        return self.model_dump_json(exclude_none=True) + "\n"
