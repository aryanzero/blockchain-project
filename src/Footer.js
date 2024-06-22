import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterContainer = styled(Box)({
  backgroundColor: '#1e1e1e',
  padding: '20px 0',
  marginTop: 'auto',
  textAlign: 'center',
  color: '#fff',
});

const Footer = () => {
  return (
    <FooterContainer>
      <Container>
        <Typography variant="body1" style={{ fontFamily: 'Poppins' }}>
          &copy; {new Date().getFullYear()} VoteGuard. All rights reserved.
        </Typography>
        <Typography variant="body2" style={{ fontFamily: 'Poppins', marginTop: '10px' }}>
          <Link href="/privacy" target="_blank" color="inherit" style={{ textDecoration: 'none', marginRight: '15px' }}>
            Privacy Policy
          </Link>
          <Link href="/terms" target="_blank" color="inherit" style={{ textDecoration: 'none', marginRight: '15px' }}>
            Terms of Service
          </Link>
          <Link href="https://github.com/aryanzero/blockchain-project" target="_blank" color="inherit" style={{ textDecoration: 'none' }}>
            Voteguard
          </Link>
        </Typography>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
