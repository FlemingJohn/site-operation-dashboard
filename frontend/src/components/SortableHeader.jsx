import { TableCell, TableSortLabel } from '@mui/material';

const SortableHeader = ({ column, label, align, sortBy, order, onSort }) => {
  if (!onSort) return <TableCell align={align}>{label}</TableCell>;

  const isActive = sortBy === column;

  return (
    <TableCell align={align} sortDirection={isActive ? order : false}>
      <TableSortLabel
        active={isActive}
        direction={isActive ? order : 'asc'}
        onClick={() => onSort(column)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
};

export default SortableHeader;
