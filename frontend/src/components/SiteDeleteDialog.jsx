import { Link as RouterLink } from 'react-router-dom';
import { DialogContentText, Link } from '@mui/material';
import DeleteDialog from './DeleteDialog';

const pluralize = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

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
        <DialogContentText>
          Want to keep the history?{' '}
          <Link component={RouterLink} to={`/sites/${site.id}/edit`}>
            Edit the site
          </Link>{' '}
          and set its status to Inactive.
        </DialogContentText>
      )}
    </DeleteDialog>
  );
};

export default SiteDeleteDialog;
