from pathlib import Path

from agents import Agent, RunContextWrapper

from siteops_ai.agent.get_today import get_today
from siteops_ai.schemas.dashboard_pages import DASHBOARD_PAGES

SYSTEM_INSTRUCTION = (Path(__file__).parent.parent / "prompts" / "system_instruction.md").read_text(
    encoding="utf-8"
)
PAGES = "\n".join(f"- {name}: {purpose}" for name, purpose in DASHBOARD_PAGES.items())


def get_instructions(context: RunContextWrapper, agent: Agent) -> str:
    return (
        f"{SYSTEM_INSTRUCTION}\n<pages>\n{PAGES}\n</pages>\n<today>{get_today():%d %b %Y}</today>"
    )
