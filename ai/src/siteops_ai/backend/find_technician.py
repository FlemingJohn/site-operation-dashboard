import httpx

from siteops_ai.backend.get_json import get_json
from siteops_ai.backend.models.page import Page
from siteops_ai.backend.models.user import User

TECHNICIAN_LIMIT = 100


async def find_technician(backend: httpx.AsyncClient, name: str | None) -> User | None:
    if not name:
        return None
    technicians = await get_json(
        backend, "/users", Page[User], role="technician", limit=TECHNICIAN_LIMIT
    )
    wanted = name.strip().lower()
    matches = [person for person in technicians.data if wanted in person.full_name.lower()]
    return matches[0] if len(matches) == 1 else None
