from siteops_ai.backend.models.api_model import ApiModel


class SparePart(ApiModel):
    id: int
    stock_level: str
