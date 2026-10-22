import httpx

from siteops_ai.settings import get_settings


def create_backend_client() -> httpx.AsyncClient:
    settings = get_settings()
    return httpx.AsyncClient(
        base_url=f"{settings.backend_api_url.rstrip('/')}/api",
        timeout=settings.backend_timeout_seconds,
        headers={"X-Service-Key": settings.ai_service_key.get_secret_value()},
    )
