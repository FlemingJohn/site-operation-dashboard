from types import SimpleNamespace

import httpx
from agents import MaxTurnsExceeded, ModelBehaviorError
from agents.stream_events import RawResponsesStreamEvent, RunItemStreamEvent
from openai import BadRequestError, RateLimitError
from openai.types.responses import ResponseTextDeltaEvent

from siteops_ai.agent.to_assistant_event import to_assistant_event
from siteops_ai.agent.to_error_message import (
    BLOCKED,
    BUSY,
    FAILED,
    TOO_MANY_STEPS,
    to_error_message,
)

AZURE = httpx.Request("POST", "https://azure.test/openai/v1/responses")


def test_text_delta_becomes_a_text_event():
    delta = ResponseTextDeltaEvent.model_construct(type="response.output_text.delta", delta="Two")
    event = to_assistant_event(RawResponsesStreamEvent(data=delta))
    assert event.type == "text"
    assert event.text == "Two"


def test_tool_call_becomes_a_step_with_a_plain_label():
    item = SimpleNamespace(raw_item=SimpleNamespace(name="list_service_due"))
    event = to_assistant_event(RunItemStreamEvent(name="tool_called", item=item))
    assert event.type == "step"
    assert event.label == "Checking which machines are due a check-up"


def test_other_events_are_skipped():
    item = SimpleNamespace(raw_item=SimpleNamespace(name="list_service_due"))
    assert to_assistant_event(RunItemStreamEvent(name="tool_output", item=item)) is None


def test_content_filter_block_has_its_own_message():
    response = httpx.Response(400, request=AZURE)
    error = BadRequestError(
        "blocked", response=response, body={"code": "content_filter", "message": "blocked"}
    )
    assert to_error_message(error) == BLOCKED


def test_answer_cut_off_by_the_content_filter_has_the_same_message():
    error = ModelBehaviorError(
        "Responses stream ended with terminal event `response.incomplete`. "
        "status=incomplete; incomplete_details=IncompleteDetails(reason='content_filter')."
    )
    assert to_error_message(error) == BLOCKED


def test_answer_cut_off_for_another_reason_gets_the_general_message():
    error = ModelBehaviorError("incomplete_details=IncompleteDetails(reason='max_output_tokens')")
    assert to_error_message(error) == FAILED


def test_rate_limit_asks_to_wait():
    error = RateLimitError("slow down", response=httpx.Response(429, request=AZURE), body=None)
    assert to_error_message(error) == BUSY


def test_too_many_turns_asks_for_a_narrower_question():
    assert to_error_message(MaxTurnsExceeded("too many")) == TOO_MANY_STEPS


def test_anything_else_gets_the_general_message():
    assert to_error_message(ValueError("boom")) == FAILED
