from secrets import compare_digest
from typing import Annotated

from fastapi import Header, HTTPException, status

from siteops_ai.security.service_key_header import SERVICE_KEY_HEADER
from siteops_ai.settings import get_settings


def require_service_key(
    service_key: Annotated[str | None, Header(alias=SERVICE_KEY_HEADER)] = None,
) -> None:
    expected = get_settings().ai_service_key.get_secret_value()
    if not service_key or not compare_digest(service_key, expected):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unknown caller.")
