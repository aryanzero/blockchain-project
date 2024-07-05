import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';

const Logo = styled('img')({
  height: '50px',
  marginRight: '15px',
});

const HeaderContainer = styled(AppBar)({
  backgroundColor: '#240046', // Changed to a vibrant blue color
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
});

const LogoLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
  flexGrow: 1,
});

const LogoutButton = styled(Button)({
  backgroundColor: '#240046', // Changed to a red color for better contrast
  color: '#fff',
  fontFamily: 'Poppins',
  fontWeight: '600',
  borderRadius: '20px',
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: '#d32f2f',
  },
});

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <HeaderContainer position="static">
      <Container>
        <Toolbar>
          <LogoLink to="/login">
            <Logo src="/vguard.webp" alt="VoteGuard Logo" />
            <Typography variant="h6" style={{ fontFamily: 'Poppins', fontWeight: '700' }}>
              VoteGuard
            </Typography>
          </LogoLink>
          {isAuthenticated && (
            <LogoutButton onClick={handleLogout}>
              Logout
            </LogoutButton>
          )}
        </Toolbar>
      </Container>
    </HeaderContainer>
  );
};

export default Header;
