from siteops_ai.backend.models.activity_target import ActivityTarget
from siteops_ai.backend.models.api_model import ApiModel


class ActivityEvent(ApiModel):
    occurred_at: str
    actor_name: str | None
    verb: str
    target: ActivityTarget
    after: str | None
    note: str | None
