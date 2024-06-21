import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import VotingSystem from './contracts/VotingSystem.json';
import Login from './Login';
import Voting from './Voting';
import Admin from './Admin'; // Import the Admin component
import './App.css'; // Create and import a CSS file for transitions

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

  useEffect(() => {
    async function loadBlockchainData() {
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
          }
        }
      }
    }

    loadBlockchainData();
  }, [isAuthenticated]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <AnimatedRoutes
          isAuthenticated={isAuthenticated}
          account={account}
          setAccount={setAccount}
          setIsAuthenticated={setIsAuthenticated}
          contract={contract}
        />
      </Router>
    </ThemeProvider>
  );
}

function AnimatedRoutes({ isAuthenticated, account, setAccount, setIsAuthenticated, contract }) {
  const location = useLocation();
  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Routes location={location}>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/voting" />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} setAccount={setAccount} />
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
            path="/admin"
            element={
              isAuthenticated ? (
                <Admin account={account} contract={contract} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default App;
