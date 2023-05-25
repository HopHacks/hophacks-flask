import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Link } from 'react-router-dom';
import '../../../stylesheets/register.css';

export default function SignUpConfirmation(props) {
  const isMobile = props.isMobile;
  return (
    <Card class="card">
      <CardContent>
        <Typography class={isMobile ? 'mobile-motto-text' : 'card-title'}>
          Account Created
        </Typography>
        <Typography class="mobile-motto-subtext">
          Thank you for signing up. We are excited to have you joining our event!
        </Typography>
        <Link to="/register/login" style={{ width: '100%' }}>
          <Button
            variant="contained"
            class="card-button"
            style={{ width: isMobile ? '80%' : '40%', height: '3rem' }}
          >
            <Typography class="mobile-motto-text">Back to Sign in</Typography>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
