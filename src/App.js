import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import VotingSystem from './contracts/VotingSystem.json';
import Login from './Login';
import Voting from './Voting';
import Admin from './Admin';
import AdminLogin from './AdminLogin';
import Privacy from './privacy';
import Terms from './terms';
import Header from './Header';
import Footer from './Footer';
import ContractAddressCheck from './ContractAddressCheck';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);

  const loadBlockchainData = async () => {
    if (window.ethereum && isAuthenticated) {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = VotingSystem.networks[networkId];
        if (deployedNetwork) {
          const contract = new web3.eth.Contract(VotingSystem.abi, deployedNetwork.address);
          setContract(contract);
        } else {
          console.error("Contract not deployed on the detected network.");
        }
      } else {
        console.error("No accounts found. Please check your MetaMask.");
      }
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, [isAuthenticated]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Box display="flex" flexDirection="column" minHeight="100vh">
          <TransitionGroup>
            <CSSTransition timeout={300} classNames="fade">
              <Routes>
                <Route path="/password" element={<ContractAddressCheck setPasswordVerified={setPasswordVerified} />} />
                <Route
                  path="/login"
                  element={
                    passwordVerified ? (
                      isAuthenticated ? (
                        <Navigate to="/voting" />
                      ) : (
                        <Login setIsAuthenticated={setIsAuthenticated} setAccount={setAccount} />
                      )
                    ) : (
                      <Navigate to="/password" />
                    )
                  }
                />
                <Route
                  path="/voting"
                  element={
                    isAuthenticated ? (
                      <Voting account={account} contract={contract} />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/admin-login"
                  element={
                    isAdminAuthenticated ? (
                      <Navigate to="/admin" />
                    ) : (
                      <AdminLogin setIsAuthenticated={setIsAdminAuthenticated} />
                    )
                  }
                />
                <Route
                  path="/admin"
                  element={
                    isAdminAuthenticated ? (
                      <Admin account={account} contract={contract} />
                    ) : (
                      <Navigate to="/admin-login" />
                    )
                  }
                />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/" element={<Navigate to="/password" />} />
              </Routes>
            </CSSTransition>
          </TransitionGroup>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
