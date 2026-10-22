from siteops_ai.choices.next_request_status import NextRequestStatus
from siteops_ai.choices.part_request_status import PartRequestStatus

PREVIOUS_REQUEST_STATUS: dict[NextRequestStatus, PartRequestStatus] = {
    "ordered": "requested",
    "delivered": "ordered",
}
