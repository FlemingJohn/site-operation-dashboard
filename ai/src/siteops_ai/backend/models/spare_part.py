from siteops_ai.backend.models.api_model import ApiModel


class SparePart(ApiModel):
    id: int
    name: str
    stock: int
    capacity: int
    stock_level: str
