import { Button, TableCell, TableRow, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const EmptyTableRow = ({ colSpan, message, onClearFilters }) => (
  <TableRow>
    <TableCell colSpan={colSpan} align="center">
      <div className="empty-state">
        <SearchOffIcon className="empty-state-icon" />
        <Typography variant="body2" className="text-strong">
          {message}
        </Typography>
        {onClearFilters && (
          <>
            <Typography variant="caption" color="text.secondary">
              Try a different search or clear the filters.
            </Typography>
            <Button size="small" variant="outlined" onClick={onClearFilters}>
              Clear filters
            </Button>
          </>
        )}
      </div>
    </TableCell>
  </TableRow>
);

export default EmptyTableRow;
