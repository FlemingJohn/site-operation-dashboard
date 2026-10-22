from fastapi.testclient import TestClient

from siteops_ai.main import app

client = TestClient(app)
SERVICE_KEY = "s" * 40


def test_health_needs_no_key():
    assert client.get("/health").json() == {"status": "ok"}


def test_ask_without_key_is_refused():
    response = client.post("/ask", json={"question": "Hi"})
    assert response.status_code == 401


def test_ask_with_wrong_key_is_refused():
    response = client.post("/ask", json={"question": "Hi"}, headers={"X-Service-Key": "wrong"})
    assert response.status_code == 401


def test_empty_question_is_rejected():
    response = client.post("/ask", json={"question": ""}, headers={"X-Service-Key": SERVICE_KEY})
    assert response.status_code == 422


def test_too_long_history_is_rejected():
    history = [{"role": "user", "text": "Hi"}] * 13
    response = client.post(
        "/ask",
        json={"question": "Hi", "history": history},
        headers={"X-Service-Key": SERVICE_KEY},
    )
    assert response.status_code == 422
