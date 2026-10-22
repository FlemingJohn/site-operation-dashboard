from siteops_ai.backend.models.api_model import ApiModel


class User(ApiModel):
    id: int
    full_name: str
