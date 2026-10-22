import { Link as RouterLink } from 'react-router-dom';
import { Button, DialogContentText } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { pluralize } from '../lib/pluralize';
import DeleteDialog from './DeleteDialog';

const getMessage = (site, hasInstallations) => {
  if (!site) return '';
  if (!hasInstallations) return `${site.name} will be permanently deleted.`;
  return `This also deletes its ${pluralize(site.installationCount, 'installation record')}. This can't be undone.`;
};

const SiteDeleteDialog = ({ site, ...dialogProps }) => {
  const hasInstallations = site?.installationCount > 0;

  return (
    <DeleteDialog
      {...dialogProps}
      title={site ? `Delete ${site.name}?` : 'Delete site?'}
      message={getMessage(site, hasInstallations)}
      confirmText={hasInstallations ? site.name : undefined}
    >
      {hasInstallations && (
        <>
          <DialogContentText>
            Want to keep the history? Set the site to Inactive instead.
          </DialogContentText>
          <Button
            variant="outlined"
            component={RouterLink}
            to={`/sites/${site.id}/edit`}
            startIcon={<EditOutlinedIcon />}
            className="dialog-side-action"
          >
            Edit site instead
          </Button>
        </>
      )}
    </DeleteDialog>
  );
};

export default SiteDeleteDialog;
