from agents import MaxTurnsExceeded, ModelBehaviorError, ModelTimeoutError
from openai import APIStatusError, APITimeoutError, RateLimitError

BLOCKED = "That question was blocked by the content filter. Please rephrase it."
BUSY = "Ask SiteOps is busy right now. Please try again in a minute."
SLOW = "Ask SiteOps took too long to answer. Please try again."
TOO_MANY_STEPS = "That needed too many lookups. Try a narrower question."
FAILED = "Sorry, I couldn't get an answer just now. Please try again."

CONTENT_FILTER = "content_filter"


def to_error_message(error: Exception) -> str:
    if is_content_filter_block(error):
        return BLOCKED
    if isinstance(error, RateLimitError):
        return BUSY
    if isinstance(error, (APITimeoutError, ModelTimeoutError)):
        return SLOW
    if isinstance(error, MaxTurnsExceeded):
        return TOO_MANY_STEPS
    return FAILED


def is_content_filter_block(error: Exception) -> bool:
    if isinstance(error, APIStatusError):
        return error.code == CONTENT_FILTER
    if isinstance(error, ModelBehaviorError):
        return CONTENT_FILTER in error.message
    return False
