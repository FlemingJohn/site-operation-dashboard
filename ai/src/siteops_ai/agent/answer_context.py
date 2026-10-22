from dataclasses import dataclass, field

import httpx

from siteops_ai.agent.source_labels import SOURCE_LABELS
from siteops_ai.schemas.card import Card
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.schemas.source import Source


@dataclass
class AnswerContext:
    backend: httpx.AsyncClient
    records: list[RecordLink] = field(default_factory=list)
    sources: list[Source] = field(default_factory=list)
    card: Card | None = None

    def remember(self, tool: str, summary: str, records: list[RecordLink]) -> None:
        self.sources.append(Source(label=SOURCE_LABELS[tool], summary=summary))
        self.records.extend(records)

    def show(self, card: Card) -> bool:
        if self.card is None or (card.is_form and not self.card.is_form):
            self.card = card
            return True
        return False
