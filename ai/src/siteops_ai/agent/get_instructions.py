from datetime import date
from pathlib import Path

from agents import Agent, RunContextWrapper

SYSTEM_INSTRUCTION = (Path(__file__).parent.parent / "prompts" / "system_instruction.md").read_text(
    encoding="utf-8"
)


def get_instructions(context: RunContextWrapper, agent: Agent) -> str:
    return f"{SYSTEM_INSTRUCTION}\n<today>{date.today():%d %b %Y}</today>"
