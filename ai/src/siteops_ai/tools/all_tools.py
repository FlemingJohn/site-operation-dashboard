from siteops_ai.tools.get_equipment import get_equipment
from siteops_ai.tools.get_summary import get_summary
from siteops_ai.tools.get_technician_workload import get_technician_workload
from siteops_ai.tools.list_installations import list_installations
from siteops_ai.tools.list_low_stock_parts import list_low_stock_parts
from siteops_ai.tools.list_service_due import list_service_due
from siteops_ai.tools.search_activity import search_activity
from siteops_ai.tools.search_sites import search_sites

ALL_TOOLS = [
    get_summary,
    search_sites,
    list_installations,
    get_technician_workload,
    list_service_due,
    get_equipment,
    list_low_stock_parts,
    search_activity,
]
