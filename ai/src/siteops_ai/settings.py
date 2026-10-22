from functools import lru_cache
from pathlib import Path

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILE, extra="ignore")

    azure_openai_api_key: SecretStr
    azure_openai_endpoint: str
    azure_openai_deployment_name: str = "gpt-4o"
    backend_api_url: str
    ai_service_key: SecretStr = Field(min_length=32)
    max_turns: int = 4
    model_timeout_seconds: float = 30
    model_max_retries: int = 2
    backend_timeout_seconds: float = 10


@lru_cache
def get_settings() -> Settings:
    return Settings()
