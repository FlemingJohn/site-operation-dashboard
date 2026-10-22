from typing import Any

import httpx


async def get_json(client: httpx.AsyncClient, path: str, **params: Any) -> Any:
    filled = {name: value for name, value in params.items() if value is not None}
    response = await client.get(path, params=filled)
    response.raise_for_status()
    return response.json()
