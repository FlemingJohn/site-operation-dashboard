import { TablePagination } from '@mui/material';

const ListPagination = ({ label = 'Rows per page:', ...paginationProps }) => (
  <TablePagination component="div" labelRowsPerPage={label} {...paginationProps} />
);

export default ListPagination;
