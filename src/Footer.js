import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterContainer = styled(Box)({
  backgroundColor: '#0d47a1', // Changed to a vibrant blue color
  padding: '40px 0', // Increased padding for better spacing
  marginTop: 'auto',
  textAlign: 'center',
  color: '#fff',
  borderTop: '5px solid #f44336', // Added a border to separate footer from content
});

const FooterLink = styled(Link)({
  textDecoration: 'none',
  margin: '0 15px',
  color: '#fff',
  fontFamily: 'Poppins',
  '&:hover': {
    color: '#f44336',
  },
});

const Footer = () => {
  return (
    <FooterContainer>
      <Container>
        <Typography variant="body1" style={{ fontFamily: 'Poppins', fontWeight: '500' }}>
          &copy; {new Date().getFullYear()} VoteGuard. All rights reserved.
        </Typography>
        <Typography variant="body2" style={{ fontFamily: 'Poppins', marginTop: '10px' }}>
          <FooterLink href="/privacy" target="_blank">
            Privacy Policy
          </FooterLink>
          <FooterLink href="/terms" target="_blank">
            Terms of Service
          </FooterLink>
          <FooterLink href="https://github.com/aryanzero/blockchain-project" target="_blank">
            Voteguard
          </FooterLink>
        </Typography>
      </Container>
    </FooterContainer>
  );
};

export default Footer;

