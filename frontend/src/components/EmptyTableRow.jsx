import { TableCell, TableRow } from '@mui/material';
import EmptyState from './EmptyState';

const EmptyTableRow = ({ colSpan, message, onClearFilters }) => (
  <TableRow>
    <TableCell colSpan={colSpan} align="center">
      <EmptyState
        title={message}
        description={onClearFilters && 'Try a different search or clear the filters.'}
        actionLabel="Clear filters"
        onAction={onClearFilters}
      />
    </TableCell>
  </TableRow>
);

export default EmptyTableRow;
