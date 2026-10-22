from agents import RunContextWrapper

from siteops_ai.agent.answer_context import AnswerContext

ToolContext = RunContextWrapper[AnswerContext]
