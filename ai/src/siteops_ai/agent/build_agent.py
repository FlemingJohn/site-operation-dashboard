from functools import lru_cache

from agents import Agent, ModelSettings, OpenAIResponsesModel, set_tracing_disabled

from siteops_ai.agent.answer_context import AnswerContext
from siteops_ai.agent.create_azure_client import create_azure_client
from siteops_ai.agent.get_instructions import get_instructions
from siteops_ai.settings import get_settings
from siteops_ai.tools.all_tools import ALL_TOOLS

MAX_ANSWER_TOKENS = 800

set_tracing_disabled(True)


@lru_cache
def build_agent() -> Agent[AnswerContext]:
    return Agent[AnswerContext](
        name="Ask SiteOps",
        instructions=get_instructions,
        tools=ALL_TOOLS,
        model=OpenAIResponsesModel(
            model=get_settings().azure_openai_deployment_name,
            openai_client=create_azure_client(),
        ),
        model_settings=ModelSettings(
            parallel_tool_calls=True,
            temperature=0.2,
            max_tokens=MAX_ANSWER_TOKENS,
        ),
    )
