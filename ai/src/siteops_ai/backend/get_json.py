from typing import Any

import httpx
from pydantic import TypeAdapter


async def get_json[Response](
    client: httpx.AsyncClient, path: str, response_type: type[Response], **params: Any
) -> Response:
    filled = {name: value for name, value in params.items() if value is not None}
    response = await client.get(path, params=filled)
    response.raise_for_status()
    return TypeAdapter(response_type).validate_python(response.json())
