from siteops_ai.backend.models.api_model import ApiModel


class TechnicianWorkloadRow(ApiModel):
    label: str
    pending: int
    in_progress: int
    completed: int
