from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from agents import Agent, RunContextWrapper

from siteops_ai.settings import get_settings

SYSTEM_INSTRUCTION = (Path(__file__).parent.parent / "prompts" / "system_instruction.md").read_text(
    encoding="utf-8"
)


def get_instructions(context: RunContextWrapper, agent: Agent) -> str:
    today = datetime.now(ZoneInfo(get_settings().timezone))
    return f"{SYSTEM_INSTRUCTION}\n<today>{today:%d %b %Y}</today>"
