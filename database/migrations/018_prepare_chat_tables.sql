CREATE OR REPLACE TRIGGER chat_sessions_set_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_chat_sessions_visitor_id_updated_at
  ON chat_sessions (visitor_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id_id ON chat_messages (session_id, id);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
