from datetime import date, datetime
from zoneinfo import ZoneInfo

from siteops_ai.settings import get_settings


def get_today() -> date:
    return datetime.now(ZoneInfo(get_settings().timezone)).date()
