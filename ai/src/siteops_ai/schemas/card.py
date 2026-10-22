from typing import Literal

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from siteops_ai.schemas.form_components import FORM_COMPONENTS
from siteops_ai.schemas.record_link import RecordLink

CardComponent = Literal[
    "machineCards", "stockRows", "markServiceDone", "reorderPart", "confirmMove"
]


class Card(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    component: CardComponent
    props: dict
    total: int | None = None
    see_all: RecordLink | None = None

    @property
    def is_form(self) -> bool:
        return self.component in FORM_COMPONENTS
