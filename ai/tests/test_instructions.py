from datetime import UTC, datetime

from siteops_ai.agent import get_instructions as instructions_module
from siteops_ai.agent.get_instructions import get_instructions


class FrozenClock(datetime):
    @classmethod
    def now(cls, tz=None):
        return datetime(2026, 10, 22, 20, 0, tzinfo=UTC).astimezone(tz)


def test_today_follows_the_configured_timezone(monkeypatch):
    monkeypatch.setattr(instructions_module, "datetime", FrozenClock)
    text = get_instructions(None, None)
    assert text.endswith("<today>23 Oct 2026</today>")


def test_instructions_start_with_the_prompt_file():
    assert get_instructions(None, None).startswith("<role>")
