from agents import MaxTurnsExceeded, ModelTimeoutError
from openai import APIStatusError, APITimeoutError, RateLimitError

BLOCKED = "That question was blocked by the content filter. Please rephrase it."
BUSY = "Ask SiteOps is busy right now. Please try again in a minute."
SLOW = "Ask SiteOps took too long to answer. Please try again."
TOO_MANY_STEPS = "That needed too many lookups. Try a narrower question."
FAILED = "Sorry, I couldn't get an answer just now. Please try again."


def to_error_message(error: Exception) -> str:
    if isinstance(error, APIStatusError) and error.code == "content_filter":
        return BLOCKED
    if isinstance(error, RateLimitError):
        return BUSY
    if isinstance(error, (APITimeoutError, ModelTimeoutError)):
        return SLOW
    if isinstance(error, MaxTurnsExceeded):
        return TOO_MANY_STEPS
    return FAILED
