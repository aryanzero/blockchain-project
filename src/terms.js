import React from 'react';
import { Container, Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const TermsContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
  backgroundColor: '#121212',
  padding: '20px',
});

const TermsCard = styled(Card)({
  width: '100%',
  maxWidth: 800,
  textAlign: 'center',
  backgroundColor: '#1e1e1e',
  color: '#fff',
  padding: '20px',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
  marginBottom: '20px',
});

const Terms = () => {
  return (
    <TermsContainer>
      <TermsCard>
        <CardContent>
          <Typography variant="h5" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '600' }}>
            Terms of Service
          </Typography>
          <Typography variant="body1" style={{ fontFamily: 'Poppins', marginBottom: '20px' }}>
            These terms govern your use of our service. By using our service, you agree to these terms.
          </Typography>
          <img src="https://via.placeholder.com/400x200" alt="Terms" style={{ marginBottom: '20px' }} />
          <Typography variant="body2" style={{ fontFamily: 'Poppins' }}>
            You are responsible for your use of our service. Do not misuse our service or help anyone else do so.
          </Typography>
        </CardContent>
      </TermsCard>
    </TermsContainer>
  );
};

export default Terms;
