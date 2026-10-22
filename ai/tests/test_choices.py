import json
import shutil
import subprocess
from pathlib import Path
from typing import get_args

import pytest

from siteops_ai.choices.activity_kind import ActivityKind
from siteops_ai.choices.activity_period import ActivityPeriod
from siteops_ai.choices.installation_status import InstallationStatus
from siteops_ai.choices.next_request_status import NextRequestStatus
from siteops_ai.choices.part_request_status import PartRequestStatus
from siteops_ai.choices.previous_request_status import PREVIOUS_REQUEST_STATUS
from siteops_ai.choices.region import Region
from siteops_ai.choices.service_state import ServiceState
from siteops_ai.choices.site_status import SiteStatus

BACKEND_CONSTANTS = Path(__file__).resolve().parents[2] / "backend" / "src" / "constants.js"


@pytest.fixture(scope="module")
def backend_constants() -> dict:
    if not shutil.which("node"):
        pytest.skip("Node.js is needed to read the backend constants")
    script = f"import('{BACKEND_CONSTANTS.as_uri()}').then((c) => console.log(JSON.stringify(c)))"
    output = subprocess.run(
        ["node", "-e", script], capture_output=True, text=True, check=True
    ).stdout
    return json.loads(output)


@pytest.mark.parametrize(
    ("choice", "backend_name"),
    [
        (InstallationStatus, "INSTALLATION_STATUSES"),
        (SiteStatus, "SITE_STATUSES"),
        (Region, "REGIONS"),
        (ServiceState, "SERVICE_STATES"),
        (ActivityKind, "ACTIVITY_KINDS"),
        (ActivityPeriod, "ACTIVITY_PERIODS"),
        (PartRequestStatus, "PART_REQUEST_STATUSES"),
        (NextRequestStatus, "NEXT_REQUEST_STATUSES"),
    ],
)
def test_choices_match_the_backend(choice, backend_name, backend_constants):
    assert list(get_args(choice)) == backend_constants[backend_name]


def test_request_moves_match_the_backend(backend_constants):
    assert PREVIOUS_REQUEST_STATUS == backend_constants["PREVIOUS_REQUEST_STATUS"]
