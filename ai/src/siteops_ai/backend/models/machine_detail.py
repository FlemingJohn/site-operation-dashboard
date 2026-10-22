from siteops_ai.backend.models.machine import Machine


class MachineDetail(Machine):
    service_records: list[dict]
