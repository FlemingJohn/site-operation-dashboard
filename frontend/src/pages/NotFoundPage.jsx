import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader } from '@mui/material';

const NotFoundPage = () => (
  <Card className="form-card">
    <CardHeader
      title="Page not found"
      subheader="The page you are looking for does not exist or has been moved."
    />
    <CardContent>
      <Button component={Link} to="/" variant="contained">
        Back to overview
      </Button>
    </CardContent>
  </Card>
);

export default NotFoundPage;
