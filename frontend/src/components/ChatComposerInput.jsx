import { ChatComposerTextArea } from '@mui/x-chat';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { ASSISTANT_QUESTION_LIMIT } from '../constants';

const ChatComposerInput = (props) => (
  <>
    <HelpOutlineOutlinedIcon className="chat-composer-icon" aria-hidden="true" />
    <ChatComposerTextArea {...props} maxRows={5} maxLength={ASSISTANT_QUESTION_LIMIT} />
  </>
);

export default ChatComposerInput;
