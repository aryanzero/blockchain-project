import React, { useState } from 'react';
import Web3 from 'web3';
import { Button, Card, CardContent, Typography, CircularProgress, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import VotingSystem from './contracts/VotingSystem.json';

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

const AdminButton = styled(Button)({
  marginTop: '20px',
  padding: '10px 30px',
  backgroundColor: '#007bff',
  fontSize: '1.1rem',
  '&:hover': {
    backgroundColor: '#0056b3',
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
  const navigate = useNavigate();

  const loginWithMetamask = async () => {
    setLoading(true);
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          const account = accounts[0];
          setAccount(account);

          // Generate public key hash
          const publicKey = CryptoJS.SHA256(account).toString(CryptoJS.enc.Hex);
          const publicKeyBytes32 = `0x${publicKey.slice(0, 64)}`;
          console.log("Public Key (bytes32):", publicKeyBytes32);

          // Get contract instance
          const networkId = await web3.eth.net.getId();
          console.log("Network ID:", networkId);
          const deployedNetwork = VotingSystem.networks[networkId];
          if (!deployedNetwork) {
            throw new Error(`Contract not deployed on network with ID ${networkId}`);
          }

          const contract = new web3.eth.Contract(
            VotingSystem.abi,
            deployedNetwork && deployedNetwork.address
          );

          // Register public key with the contract
          console.log("Registering public key with the contract...");
          await contract.methods.registerPublicKey(publicKeyBytes32).send({ from: account, gas: 300000 });

          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error requesting accounts or registering public key:', error);
        alert('There was an error requesting accounts or registering public key. Please try again.');
      }
    } else {
      alert('Please install Metamask to use this app.');
    }
    setLoading(false);
  };

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginContent>
          <Logo src={`${process.env.PUBLIC_URL}/metamask-logo.png`} alt="MetaMask Logo" />
          <Typography variant="h4" gutterBottom style={{ fontFamily: 'Arial, sans-serif' }}>
            Login with MetaMask
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
          <AdminButton
            variant="contained"
            onClick={handleAdminLogin}
          >
            Admin?
          </AdminButton>
        </LoginContent>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;
