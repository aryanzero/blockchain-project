// ContractAddressCheck.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, TextField, Button, Box, Alert, Link } from '@mui/material';
import { styled, css, keyframes } from '@mui/material/styles';
import VotingSystem from './contracts/VotingSystem.json';

const PasswordContainer = styled(Container)(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    background-color: #FFFFFF;
    max-width: 1900px !important;
    width: 100%;
  `,
);

const PasswordCard = styled(Card)({
  padding: '40px 20px',
  textAlign: 'center',
  backgroundColor: '#ffffff',
  color: '#240750',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Added shadow for better visibility
});

const PasswordButton = styled(Button)({
  marginTop: '20px',
  padding: '10px 30px',
  backgroundColor: '#6200ea',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#4a148c',
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#4a148c', // Add outline color
    },
    '&:hover fieldset': {
      borderColor: '#4a148c', // Outline color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#4a148c', // Outline color when focused
    },
    '& input': {
      color: '#000', // Set input text color to black
    },
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

const PasswordContent = styled(CardContent)({
  animation: `${fadeIn} 1s ease-in-out`,
});

const StyledLink = styled(Link)({
  color: '#6200ea',
  marginTop: '20px',
  fontSize: '1rem',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

function ContractAddressCheck({ setPasswordVerified }) {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const navigate = useNavigate();

  const handlePasswordSubmit = () => {
    const deployedAddress = VotingSystem.networks[5777].address; // Replace 5777 with your network ID
    if (password === deployedAddress) {
      setPasswordVerified(true);
      navigate('/login');
    } else {
      setMessageType('error');
      setMessage('Invalid contract address. Please try again.');
    }
  };

  return (
    <PasswordContainer>
      <PasswordCard>
        <PasswordContent>
          <Logo src={`${process.env.PUBLIC_URL}/metamask-logo.png`} alt="MetaMask Logo" />
          <Typography variant="h4" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '700', color: '#240750' }}>
            Enter Contract Address
          </Typography>
          <Typography variant="body1" style={{ marginBottom: '20px', fontFamily: 'Poppins', color: '#240750' }}>
            Please enter the contract address to proceed.
          </Typography>
          <StyledTextField
            label="Contract Address"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordButton variant="contained" onClick={handlePasswordSubmit}>
            Submit
          </PasswordButton>
          {message && (
            <Alert severity={messageType} style={{ marginTop: '20px' }}>
              {message}
            </Alert>
          )}
          <Box marginTop="20px">
            <StyledLink href="/admin-login" variant="body2">
              Are you an admin?
            </StyledLink>
          </Box>
        </PasswordContent>
      </PasswordCard>
    </PasswordContainer>
  );
}

export default ContractAddressCheck;
