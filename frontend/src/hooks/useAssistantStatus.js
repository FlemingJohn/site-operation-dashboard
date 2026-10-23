import { useContext } from 'react';
import { AssistantStatusContext } from '../assistant/AssistantStatusContext';

export const useAssistantStatus = () => useContext(AssistantStatusContext);
