import ChatHeaderMark from './ChatHeaderMark';

const ChatHeader = ({ children }) => (
  <div className="chat-header">
    <ChatHeaderMark />
    {children}
  </div>
);

export default ChatHeader;
