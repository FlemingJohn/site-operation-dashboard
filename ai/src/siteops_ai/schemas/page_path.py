class PagePath:
    OVERVIEW = "/"
    INSTALLATIONS = "/installations"
    SERVICE = "/service"
    SPARE_PARTS = "/spare-parts"

    @staticmethod
    def site(site_id: int) -> str:
        return f"/sites/{site_id}"

    @staticmethod
    def machine(machine_id: int) -> str:
        return f"/equipment/{machine_id}"
