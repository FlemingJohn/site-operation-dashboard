from agents import StreamEvent
from openai.types.responses import ResponseTextDeltaEvent

from siteops_ai.agent.step_labels import STEP_LABELS
from siteops_ai.schemas.assistant_event import AssistantEvent


def to_assistant_event(event: StreamEvent) -> AssistantEvent | None:
    if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
        return AssistantEvent(type="text", text=event.data.delta)
    if event.type == "run_item_stream_event" and event.name == "tool_called":
        tool_name = event.item.raw_item.name
        return AssistantEvent(type="step", label=STEP_LABELS.get(tool_name, "Looking it up"))
    return None
