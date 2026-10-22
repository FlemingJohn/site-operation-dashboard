import httpx

from siteops_ai.backend.get_json import get_json
from siteops_ai.backend.models.machine import Machine
from siteops_ai.backend.models.page import Page

MATCH_LIMIT = 5


async def find_machine(backend: httpx.AsyncClient, serial: str) -> tuple[Machine | None, list]:
    matches = (
        await get_json(backend, "/equipment", Page[Machine], search=serial, limit=MATCH_LIMIT)
    ).data
    exact = [unit for unit in matches if unit.serial.lower() == serial.strip().lower()]
    if exact:
        return exact[0], matches
    return (matches[0] if len(matches) == 1 else None), matches
