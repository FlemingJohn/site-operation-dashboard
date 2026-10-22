from pydantic import BaseModel, Field

from siteops_ai.schemas.chat_message import ChatMessage


class AskRequest(BaseModel):
    question: str = Field(min_length=1, max_length=300)
    history: list[ChatMessage] = Field(default_factory=list, max_length=12)
