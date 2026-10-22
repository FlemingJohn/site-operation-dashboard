from siteops_ai.backend.models.api_model import ApiModel
from siteops_ai.backend.models.technician_workload_row import TechnicianWorkloadRow


class Summary(ApiModel):
    totals: dict
    status_breakdown: list[dict]
    monthly_installations: list[dict]
    installations_by_technician: list[TechnicianWorkloadRow]
