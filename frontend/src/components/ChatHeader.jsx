import ChatHeaderMark from './ChatHeaderMark';
import ChatWakeBanner from './ChatWakeBanner';

const ChatHeader = ({ children }) => (
  <>
    <div className="chat-header">
      <ChatHeaderMark />
      {children}
    </div>
    <ChatWakeBanner />
  </>
);

export default ChatHeader;
