from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from agents import Agent, RunContextWrapper

from siteops_ai.schemas.dashboard_pages import DASHBOARD_PAGES
from siteops_ai.settings import get_settings

SYSTEM_INSTRUCTION = (Path(__file__).parent.parent / "prompts" / "system_instruction.md").read_text(
    encoding="utf-8"
)
PAGES = "\n".join(f"- {name}: {purpose}" for name, purpose in DASHBOARD_PAGES.items())


def get_instructions(context: RunContextWrapper, agent: Agent) -> str:
    today = datetime.now(ZoneInfo(get_settings().timezone))
    return f"{SYSTEM_INSTRUCTION}\n<pages>\n{PAGES}\n</pages>\n<today>{today:%d %b %Y}</today>"
