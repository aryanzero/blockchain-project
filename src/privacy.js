import React from 'react';
import { Container, Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const PrivacyContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
  backgroundColor: '#121212',
  padding: '20px',
});

const PrivacyCard = styled(Card)({
  width: '100%',
  maxWidth: 800,
  textAlign: 'center',
  backgroundColor: '#1e1e1e',
  color: '#fff',
  padding: '20px',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
  marginBottom: '20px',
});

const Privacy = () => {
  return (
    <PrivacyContainer>
      <PrivacyCard>
        <CardContent>
          <Typography variant="h5" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '600' }}>
            Privacy Policy
          </Typography>
          <Typography variant="body1" style={{ fontFamily: 'Poppins', marginBottom: '20px' }}>
            Your privacy is important to us. This policy explains how we handle and use your personal information.
          </Typography>
          <img src="https://via.placeholder.com/400x200" alt="Privacy" style={{ marginBottom: '20px' }} />
          <Typography variant="body2" style={{ fontFamily: 'Poppins' }}>
            We collect information to provide better services to our users. The information we collect includes login details, user preferences, and voting data.
          </Typography>
        </CardContent>
      </PrivacyCard>
    </PrivacyContainer>
  );
};

export default Privacy;
