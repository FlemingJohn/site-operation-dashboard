from pydantic import BaseModel


class Source(BaseModel):
    label: str
    summary: str
