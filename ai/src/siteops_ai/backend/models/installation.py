from siteops_ai.backend.models.api_model import ApiModel


class Installation(ApiModel):
    id: int
    site_id: int
    site_name: str
