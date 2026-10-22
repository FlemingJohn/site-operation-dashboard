import { useCallback, useEffect, useRef, useState } from 'react';
import {
  deleteAllChatSessions,
  deleteChatSession,
  getChatSessions,
  renameChatSession,
} from '../api/chatSessionsApi';
import { isDraftChatId, makeDraftChatId } from '../assistant/draftChatId';
import { toChatConversation } from '../assistant/toChatConversation';

const NEW_CHAT_TITLE = 'New chat';

export const useChatSessions = () => {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(makeDraftChatId);
  const [loadError, setLoadError] = useState(null);
  const activeIdRef = useRef(activeId);
  const savedSession = useRef(null);

  const changeActive = useCallback((id) => {
    activeIdRef.current = id;
    setActiveId(id);
  }, []);

  const reload = useCallback(async () => {
    try {
      const { data } = await getChatSessions();
      setConversations(data.map(toChatConversation));
      setLoadError(null);
    } catch (error) {
      setLoadError(error.message);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const startNewChat = useCallback(() => changeActive(makeDraftChatId()), [changeActive]);

  const rememberSession = useCallback((session) => {
    savedSession.current = session;
  }, []);

  const handleAnswerFinished = useCallback(async () => {
    const session = savedSession.current;
    savedSession.current = null;
    await reload();
    if (session && isDraftChatId(activeIdRef.current)) changeActive(session.id);
  }, [changeActive, reload]);

  const listed = isDraftChatId(activeId)
    ? [{ id: activeId, title: NEW_CHAT_TITLE }, ...conversations]
    : conversations;

  return {
    conversations: listed,
    savedConversations: conversations,
    activeId,
    loadError,
    selectChat: (id) => id && changeActive(id),
    startNewChat,
    rememberSession,
    handleAnswerFinished,
    renameChat: async (id, title) => {
      await renameChatSession(id, title);
      await reload();
    },
    deleteChat: async (id) => {
      await deleteChatSession(id);
      if (id === activeIdRef.current) startNewChat();
      await reload();
    },
    clearAllChats: async () => {
      const { deleted } = await deleteAllChatSessions();
      startNewChat();
      setConversations([]);
      return deleted;
    },
  };
};
