import logging

from fastapi import Depends, FastAPI
from fastapi.responses import StreamingResponse

from siteops_ai.agent.stream_answer import stream_answer
from siteops_ai.schemas.ask_request import AskRequest
from siteops_ai.security.require_service_key import require_service_key

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")

app = FastAPI(title="SiteOps AI", docs_url=None, redoc_url=None)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}


@app.post("/ask", dependencies=[Depends(require_service_key)])
async def ask(request: AskRequest) -> StreamingResponse:
    return StreamingResponse(
        stream_answer(request),
        media_type="application/x-ndjson",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
