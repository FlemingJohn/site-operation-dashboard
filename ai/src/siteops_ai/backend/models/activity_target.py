from siteops_ai.backend.models.api_model import ApiModel


class ActivityTarget(ApiModel):
    label: str
    path: str
