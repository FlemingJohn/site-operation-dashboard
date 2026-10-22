import os

os.environ.update(
    AZURE_OPENAI_API_KEY="test-azure-key",
    AZURE_OPENAI_ENDPOINT="https://azure.test/",
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o",
    BACKEND_API_URL="http://backend.test",
    AI_SERVICE_KEY="s" * 40,
)
