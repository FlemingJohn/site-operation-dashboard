from pydantic import BaseModel


class Source(BaseModel):
    tool: str
    summary: str
