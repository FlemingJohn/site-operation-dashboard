import { TableCell, TableSortLabel } from '@mui/material';

const TableHeaderCell = ({ column, label, icon: Icon, align, sortBy, order, onSort }) => {
  const content = (
    <span className="table-header">
      {Icon && <Icon className="table-header-icon" />}
      {label}
    </span>
  );

  if (!onSort || !column) return <TableCell align={align}>{content}</TableCell>;

  const isActive = sortBy === column;

  return (
    <TableCell align={align} sortDirection={isActive ? order : false}>
      <TableSortLabel
        active={isActive}
        direction={isActive ? order : 'asc'}
        onClick={() => onSort(column)}
      >
        {content}
      </TableSortLabel>
    </TableCell>
  );
};

export default TableHeaderCell;
