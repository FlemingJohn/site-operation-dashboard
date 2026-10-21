import { Avatar } from '@mui/material';

const TONE_COUNT = 6;

const getInitials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const getTone = (name) =>
  ([...name].reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % TONE_COUNT) + 1;

const PersonAvatar = ({ name }) => (
  <Avatar className={`person-avatar person-avatar-tone-${getTone(name)}`}>
    {getInitials(name)}
  </Avatar>
);

export default PersonAvatar;
