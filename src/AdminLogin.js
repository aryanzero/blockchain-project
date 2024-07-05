import React, { useState } from 'react';
import { Button, TextField, Card, CardContent, Typography, CircularProgress, Container } from '@mui/material';
import { styled, css } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from './firebase';

const AdminLoginContainer = styled(Container)(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    background-color: #ffffff; // light blue background
    max-width: 1900px !important;
    width: 100%;
  `,
);

const AdminLoginCard = styled(Card)({
  padding: '40px 20px',
  textAlign: 'center',
  backgroundColor: '#ffffff', // light grey background
  color: '#240750', // text color
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
});

const LoginButton = styled(Button)({
  marginTop: '20px',
  padding: '10px 30px',
  backgroundColor: '#6200ea', // button color
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#4a148c', // darker button color on hover
  },
});

const Logo = styled('img')({
  width: '75px', // Reduced size
  marginBottom: '20px',
});

function AdminLogin({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      navigate('/admin');
    } catch (error) {
      console.error('Error signing in with password and email', error);
      alert('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <AdminLoginContainer style={{ maxwidth: '1920px !important'}}>
      <AdminLoginCard style={{ minwidth: '1920px !important'}}>
        <CardContent style={{ maxwidth: '1920px !important'}}>
          <Logo src="/manager.png" alt="Admin Logo" />
          <Typography variant="h4" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '700', color: '#240750' }}>
            Admin Login
          </Typography>
          <TextField
            label="Email"
            variant="filled"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ style: { color: '#240750', backgroundColor: '#ffffff' } }} // Ensure visibility
            InputLabelProps={{ style: { color: '#240750' } }}
          />
          <TextField
            label="Password"
            type="password"
            variant="filled"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ style: { color: '#240750', backgroundColor: '#ffffff' } }} // Ensure visibility
            InputLabelProps={{ style: { color: '#240750' } }}
          />
          <LoginButton
            variant="contained"
            color="primary"
            onClick={handleAdminLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </LoginButton>
        </CardContent>
      </AdminLoginCard>
    </AdminLoginContainer>
  );
}

export default AdminLogin;
