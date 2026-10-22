import { Typography } from '@mui/material';

const ChatErrorPart = ({ part }) => (
  <Typography variant="body2" color="error" role="alert">
    {part.data.message}
  </Typography>
);

export default ChatErrorPart;
