import httpx

from siteops_ai.backend.get_json import get_json
from siteops_ai.backend.models.page import Page
from siteops_ai.backend.models.spare_part import SparePart
from siteops_ai.backend.to_singular import to_singular

MATCH_LIMIT = 5


async def find_part(backend: httpx.AsyncClient, name: str) -> tuple[SparePart | None, list]:
    matches = await search_parts(backend, name) or await search_parts(backend, to_singular(name))
    wanted = {name.strip().lower(), to_singular(name).lower()}
    exact = [part for part in matches if part.name.lower() in wanted]
    if exact:
        return exact[0], matches
    return (matches[0] if len(matches) == 1 else None), matches


async def search_parts(backend: httpx.AsyncClient, name: str) -> list[SparePart]:
    page = await get_json(backend, "/spare-parts", Page[SparePart], search=name, limit=MATCH_LIMIT)
    return page.data
