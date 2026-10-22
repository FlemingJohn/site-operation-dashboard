from pydantic import BaseModel


class RecordLink(BaseModel):
    label: str
    path: str
