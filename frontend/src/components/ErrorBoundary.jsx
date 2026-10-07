import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, Stack } from '@mui/material';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Card className="form-card">
        <CardHeader
          title="Something went wrong on this page"
          subheader="Reload the page, or go back to the overview and try again."
        />
        <CardContent>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Reload page
            </Button>
            <Button component={Link} to="/" variant="outlined" color="inherit">
              Back to overview
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }
}

export default ErrorBoundary;
