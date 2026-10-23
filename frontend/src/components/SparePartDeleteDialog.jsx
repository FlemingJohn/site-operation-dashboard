import { Alert } from '@mui/material';
import { pluralize } from '../lib/pluralize';
import DeleteDialog from './DeleteDialog';

const SparePartDeleteDialog = ({ part, ...dialogProps }) => {
  const hasRequests = part?.requestCount > 0;

  return (
    <DeleteDialog
      {...dialogProps}
      title={describeTitle(part, hasRequests)}
      message={describeMessage(part, hasRequests)}
      canDelete={!hasRequests}
    >
      {hasRequests && (
        <Alert severity="info">
          To stop it showing as running low, edit it and set its stock and reorder level to 0.
        </Alert>
      )}
    </DeleteDialog>
  );
};

const describeTitle = (part, hasRequests) => {
  if (!part) return 'Delete part?';
  return hasRequests ? `${part.name} can't be deleted` : `Delete ${part.name}?`;
};

const describeMessage = (part, hasRequests) => {
  if (!part) return '';
  if (hasRequests) {
    const verb = part.requestCount === 1 ? 'uses' : 'use';
    return `${pluralize(part.requestCount, 'request')} ${verb} this part, and a request must always say which part it was for.`;
  }
  return `${part.name} and its ${part.stock} in stock will be removed from the list.`;
};

export default SparePartDeleteDialog;
