import AssistantCard from '../components/AssistantCard';
import ChatErrorPart from '../components/ChatErrorPart';
import ChatRecordsPart from '../components/ChatRecordsPart';
import ChatStepPart from '../components/ChatStepPart';

export const buildPartRenderers = (onOpenRecord) => ({
  'dynamic-tool': ChatStepPart,
  'data-card': ({ part }) => <AssistantCard card={part.data} onOpenRecord={onOpenRecord} />,
  'data-records': ({ part }) => <ChatRecordsPart part={part} onOpenRecord={onOpenRecord} />,
  'data-error': ChatErrorPart,
});
