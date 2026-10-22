import AssistantSources from './AssistantSources';
import RecordChip from './RecordChip';

const ChatRecordsPart = ({ part, onOpenRecord }) => {
  const { records, sources } = part.data;

  return (
    <div className="assistant-answer-footer">
      {records.length > 0 && (
        <div className="assistant-records">
          {records.map((record) => (
            <RecordChip
              key={`${record.path}-${record.label}`}
              label={record.label}
              path={record.path}
              onOpen={onOpenRecord}
            />
          ))}
        </div>
      )}
      {sources.length > 0 && <AssistantSources sources={sources} />}
    </div>
  );
};

export default ChatRecordsPart;
