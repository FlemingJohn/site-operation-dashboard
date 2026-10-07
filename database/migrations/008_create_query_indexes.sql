DROP INDEX IF EXISTS idx_installations_site_id;

CREATE INDEX IF NOT EXISTS idx_installations_site_id_installed_on
  ON installations (site_id, installed_on DESC);

CREATE INDEX IF NOT EXISTS idx_installations_installed_on
  ON installations (installed_on DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_installations_status
  ON installations (status);

CREATE INDEX IF NOT EXISTS idx_sites_status
  ON sites (status);

CREATE INDEX IF NOT EXISTS idx_sites_region
  ON sites (region);
