import React, { useState } from 'react';
import Web3 from 'web3';
import { Button, Card, CardContent, Typography, CircularProgress, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

const LoginContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center',
  backgroundColor: '#121212',
});

const LoginCard = styled(Card)({
  maxWidth: 600,
  padding: '40px 20px',
  textAlign: 'center',
  backgroundColor: '#1e1e1e',
  color: '#fff',
});

const LoginButton = styled(Button)({
  marginTop: '20px',
  padding: '10px 30px',
  backgroundColor: '#f6851b',
  fontSize: '1.1rem',
  '&:hover': {
    backgroundColor: '#e57c04',
    color: '#fff',
  },
});

const Logo = styled('img')({
  width: '150px',
  marginBottom: '20px',
});

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const LoginContent = styled(CardContent)({
  animation: `${fadeIn} 1s ease-in-out`,
});

function Login({ setIsAuthenticated, setAccount }) {
  const [loading, setLoading] = useState(false);

  const loginWithMetamask = async () => {
    setLoading(true);
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error requesting accounts:', error);
        alert('There was an error requesting accounts. Please try again.');
      }
    } else {
      alert('Please install Metamask to use this app.');
    }
    setLoading(false);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginContent>
          <Logo src={`${process.env.PUBLIC_URL}/metamask-logo.png`} alt="MetaMask Logo" />
          <Typography variant="h4" gutterBottom style={{ fontFamily: 'Arial, sans-serif' }}>
            Login with Metamask
          </Typography>
          <Typography variant="body1" style={{ marginBottom: '20px', fontFamily: 'Arial, sans-serif' }}>
            Access your blockchain voting account securely with MetaMask. Click the button below to connect your wallet and get started.
          </Typography>
          <LoginButton
            variant="contained"
            color="primary"
            onClick={loginWithMetamask}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </LoginButton>
        </LoginContent>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;
