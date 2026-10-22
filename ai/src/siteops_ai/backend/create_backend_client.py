import httpx

from siteops_ai.security.service_key_header import SERVICE_KEY_HEADER
from siteops_ai.settings import get_settings

API_PREFIX = "/api"


def create_backend_client() -> httpx.AsyncClient:
    settings = get_settings()
    return httpx.AsyncClient(
        base_url=settings.backend_api_url.rstrip("/") + API_PREFIX,
        timeout=settings.backend_timeout_seconds,
        headers={SERVICE_KEY_HEADER: settings.ai_service_key.get_secret_value()},
    )
