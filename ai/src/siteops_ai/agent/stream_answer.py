import logging
from collections.abc import AsyncIterator

from agents import Runner

from siteops_ai.agent.answer_context import AnswerContext
from siteops_ai.agent.build_agent import build_agent
from siteops_ai.agent.to_assistant_event import to_assistant_event
from siteops_ai.agent.to_error_message import to_error_message
from siteops_ai.backend.create_backend_client import create_backend_client
from siteops_ai.schemas.ask_request import AskRequest
from siteops_ai.schemas.assistant_event import AssistantEvent
from siteops_ai.settings import get_settings

MAX_RECORDS = 8
NO_ANSWER = "I couldn't find an answer to that in the dashboard."

logger = logging.getLogger(__name__)


async def stream_answer(request: AskRequest) -> AsyncIterator[str]:
    async with create_backend_client() as backend:
        context = AnswerContext(backend=backend)
        yield AssistantEvent(type="thinking").to_line()
        has_text = False
        try:
            result = Runner.run_streamed(
                build_agent(),
                input=to_input(request),
                context=context,
                max_turns=get_settings().max_turns,
            )
            async for event in result.stream_events():
                assistant_event = to_assistant_event(event)
                if assistant_event:
                    has_text = has_text or assistant_event.type == "text"
                    yield assistant_event.to_line()
        except Exception as error:
            logger.exception("Ask SiteOps failed")
            yield AssistantEvent(type="error", message=to_error_message(error)).to_line()
            return

        if not has_text:
            yield AssistantEvent(type="text", text=NO_ANSWER).to_line()
        if context.card:
            yield AssistantEvent(type="ui", card=context.card).to_line()
        records = list({(r.path, r.label): r for r in context.records}.values())
        yield AssistantEvent(
            type="done", records=records[:MAX_RECORDS], sources=context.sources
        ).to_line()


def to_input(request: AskRequest) -> list[dict]:
    history = [{"role": message.role, "content": message.text} for message in request.history]
    return [*history, {"role": "user", "content": request.question}]
