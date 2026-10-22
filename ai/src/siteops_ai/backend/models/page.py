from siteops_ai.backend.models.api_model import ApiModel
from siteops_ai.backend.models.pagination import Pagination


class Page[Item: ApiModel](ApiModel):
    data: list[Item]
    pagination: Pagination
