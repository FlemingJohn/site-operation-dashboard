from siteops_ai.backend.models.api_model import ApiModel


class PartRequest(ApiModel):
    id: int
    part_id: int
    part_name: str
    quantity: int
    serial: str | None
