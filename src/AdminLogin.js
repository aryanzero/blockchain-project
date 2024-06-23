
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
  backgroundColor: '#121212',
});

const AdminLoginCard = styled(Card)({
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
          <Typography variant="h4" gutterBottom style={{ fontFamily: 'Arial, sans-serif' }}>
            Admin Login
          </Typography>
          <TextField
            label="Email"
            variant="filled"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#fff' } }}
          />
          <TextField
            label="Password"
            type="password"
            variant="filled"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#fff' } }}
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
