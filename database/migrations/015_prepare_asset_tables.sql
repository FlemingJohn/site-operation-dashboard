CREATE OR REPLACE TRIGGER equipment_set_updated_at
  BEFORE UPDATE ON equipment
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER spare_parts_set_updated_at
  BEFORE UPDATE ON spare_parts
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER part_requests_set_updated_at
  BEFORE UPDATE ON part_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_equipment_site_id ON equipment (site_id);

CREATE INDEX IF NOT EXISTS idx_equipment_next_service_on ON equipment (next_service_on, id);

CREATE INDEX IF NOT EXISTS idx_service_records_equipment_id_done_on
  ON service_records (equipment_id, done_on DESC);

CREATE INDEX IF NOT EXISTS idx_service_records_technician_id ON service_records (technician_id);

CREATE INDEX IF NOT EXISTS idx_part_requests_status ON part_requests (status, requested_on DESC);

CREATE INDEX IF NOT EXISTS idx_part_requests_part_id ON part_requests (part_id);

CREATE INDEX IF NOT EXISTS idx_part_requests_equipment_id ON part_requests (equipment_id);

CREATE INDEX IF NOT EXISTS idx_part_requests_requested_by ON part_requests (requested_by);

CREATE INDEX IF NOT EXISTS idx_activity_log_occurred_at ON activity_log (occurred_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_activity_log_target_path ON activity_log (target_path, occurred_at DESC);

ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;

ALTER TABLE spare_parts ENABLE ROW LEVEL SECURITY;

ALTER TABLE part_requests ENABLE ROW LEVEL SECURITY;

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
