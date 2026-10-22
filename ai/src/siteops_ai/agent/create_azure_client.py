from openai import AsyncOpenAI

from siteops_ai.settings import get_settings


def create_azure_client() -> AsyncOpenAI:
    settings = get_settings()
    return AsyncOpenAI(
        base_url=f"{settings.azure_openai_endpoint.rstrip('/')}/openai/v1/",
        api_key=settings.azure_openai_api_key.get_secret_value(),
        timeout=settings.model_timeout_seconds,
        max_retries=settings.model_max_retries,
    )
