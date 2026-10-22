export const toChatConversation = (session) => ({
  id: session.id,
  title: session.title,
  subtitle: session.lastMessage ?? undefined,
  lastMessageAt: session.updatedAt,
  metadata: { messageCount: session.messageCount },
});
