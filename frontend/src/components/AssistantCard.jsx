import { CARD_REGISTRY } from '../assistant/cardRegistry';
import { assistantCardSchema } from '../validation/assistantCardSchema';

const AssistantCard = ({ card, onOpenRecord }) => {
  const envelope = assistantCardSchema.safeParse(card);
  const entry = envelope.success && CARD_REGISTRY[envelope.data.component];
  const props = entry && entry.schema.safeParse(envelope.data.props);
  if (!props?.success) return null;

  const Card = entry.component;
  return (
    <div className="assistant-card">
      <Card
        {...props.data}
        total={envelope.data.total}
        seeAll={envelope.data.seeAll}
        onOpenRecord={onOpenRecord}
      />
    </div>
  );
};

export default AssistantCard;
