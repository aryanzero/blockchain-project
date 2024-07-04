import React, { useState } from 'react';
import { Button, TextField, Card, CardContent, Typography, CircularProgress, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from './firebase';

const AdminLoginContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center',
  backgroundColor: '#e3f2fd', // light blue background
});

const AdminLoginCard = styled(Card)({
  maxWidth: 600,
  padding: '40px 20px',
  textAlign: 'center',
  backgroundColor: '#ffffff', // light grey background
  color: '#1e1e1e',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
});

const LoginButton = styled(Button)({
  marginTop: '20px',
  padding: '10px 30px',
  backgroundColor: '#f44336', // red color
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#d32f2f', // darker red on hover
  },
});

const Logo = styled('img')({
  width: '150px',
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
    <AdminLoginContainer>
      <AdminLoginCard>
        <CardContent>
          <Logo src={`${process.env.PUBLIC_URL}/admin-logo.png`} alt="Admin Logo" />
          <Typography variant="h4" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '700', color: '#0d47a1' }}>
            Admin Login
          </Typography>
          <TextField
            label="Email"
            variant="filled"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ style: { color: '#1e1e1e', backgroundColor: '#ffffff' } }} // Ensure visibility
            InputLabelProps={{ style: { color: '#1e1e1e' } }}
          />
          <TextField
            label="Password"
            type="password"
            variant="filled"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ style: { color: '#1e1e1e', backgroundColor: '#ffffff' } }} // Ensure visibility
            InputLabelProps={{ style: { color: '#1e1e1e' } }}
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
