from datetime import date
from typing import Annotated

from agents import function_tool
from pydantic import Field

from siteops_ai.agent.get_today import get_today
from siteops_ai.backend.find_machine import find_machine
from siteops_ai.backend.find_technician import find_technician
from siteops_ai.schemas.card import Card
from siteops_ai.schemas.page_path import PagePath
from siteops_ai.schemas.record_link import RecordLink
from siteops_ai.tools.tool_context import ToolContext


@function_tool(
    description_override=(
        "Prepare a finished check-up for one machine as a form the person checks and saves. "
        "It never saves anything. Leave a value empty when the person did not give it."
    )
)
async def prepare_service_done(
    context: ToolContext,
    serial: Annotated[str, Field(min_length=1, description="Serial number, such as BY-204")],
    done_on: Annotated[date | None, Field(description="Day the check-up was done")],
    technician_name: Annotated[str | None, Field(description="Who did it, as the person said")],
    notes: Annotated[str | None, Field(max_length=500, description="What was done")],
) -> dict:
    backend = context.context.backend
    machine, matches = await find_machine(backend, serial)
    if not machine:
        return {
            "error": "No single machine matches that serial. Ask which one.",
            "machines": [unit.serial for unit in matches],
        }
    today = get_today()
    if done_on and done_on > today:
        return {"error": "The check-up date cannot be in the future."}

    technician = await find_technician(backend, technician_name)
    unit = machine.to_tool_result()
    is_form_shown = context.context.show(
        Card(
            component="markServiceDone",
            props={
                "machine": {key: unit.get(key) for key in ("id", "serial", "type", "siteName")},
                "doneOn": (done_on or today).isoformat(),
                "technicianId": technician.id if technician else None,
                "notes": notes or "",
            },
        )
    )
    context.context.remember(
        "prepare_service_done",
        f"Prepared a check-up for {machine.serial}",
        [RecordLink(label=machine.serial, path=PagePath.machine(machine.id))],
    )
    return {
        "prepared": "check-up form",
        "machine": machine.serial,
        "technicianFound": bool(technician),
        "formShown": is_form_shown,
        "savedYet": False,
    }
