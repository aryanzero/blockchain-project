// import React, { useState } from 'react';
// import Web3 from 'web3';
// import { Button, Card, CardContent, Typography, CircularProgress, Container, Box, Alert } from '@mui/material';
// import { styled, css, keyframes } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';
// import CryptoJS from 'crypto-js';
// import VotingSystem from './contracts/VotingSystem.json';

// const LoginContainer = styled(Container)(
//   () => css`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     height: 100vh;
//     text-align: center;
//     background-color: #FFFFFF; // light blue background
//     max-width: 1900px !important;
//     width: 100%;
//   `,
// );

// const LoginCard = styled(Card)({
//   padding: '40px 20px',
//   textAlign: 'center',
//   backgroundColor: '#ffffff', // light grey background
//   color: '#240750',
//   boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
// });

// const LoginButton = styled(Button)({
//   marginTop: '20px',
//   padding: '10px 30px',
//   backgroundColor: '#6200ea', // purple color
//   fontSize: '1.1rem',
//   fontWeight: 'bold',
//   color: '#fff',
//   '&:hover': {
//     backgroundColor: '#4a148c', // darker purple on hover
//   },
// });

// const AdminButton = styled(Button)({
//   marginTop: '20px',
//   padding: '10px 30px',
//   backgroundColor: '#9575cd', // lighter purple color
//   fontSize: '1.1rem',
//   fontWeight: 'bold',
//   color: '#fff',
//   '&:hover': {
//     backgroundColor: '#7e57c2', // slightly darker purple on hover
//   },
// });

// const Logo = styled('img')({
//   width: '150px',
//   marginBottom: '20px',
// });

// const fadeIn = keyframes`
//   from {
//     opacity: 0;
//   }
//   to {
//     opacity: 1;
//   }
// `;

// const LoginContent = styled(CardContent)({
//   animation: `${fadeIn} 1s ease-in-out`,
// });

// function Login({ setIsAuthenticated, setAccount }) {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('info');
//   const navigate = useNavigate();

//   const loginWithMetamask = async () => {
//     setLoading(true);
//     setMessage('');
//     if (window.ethereum) {
//       const web3 = new Web3(window.ethereum);
//       try {
//         await window.ethereum.request({ method: 'eth_requestAccounts' });
//         const accounts = await web3.eth.getAccounts();
//         if (accounts.length > 0) {
//           const account = accounts[0];
//           setAccount(account);

//           // Generate public key hash
//           const publicKey = CryptoJS.SHA256(account).toString(CryptoJS.enc.Hex);
//           const publicKeyBytes32 = `0x${publicKey.slice(0, 64)}`;
//           console.log("Public Key (bytes32):", publicKeyBytes32);

//           // Get contract instance
//           const networkId = await web3.eth.net.getId();
//           console.log("Network ID:", networkId);
//           const deployedNetwork = VotingSystem.networks[networkId];
//           if (!deployedNetwork) {
//             throw new Error(`Contract not deployed on network with ID ${networkId}`);
//           }

//           const contract = new web3.eth.Contract(
//             VotingSystem.abi,
//             deployedNetwork && deployedNetwork.address
//           );

//           // Check if the public key is already registered
//           const voter = await contract.methods.voters(account).call();
//           if (voter.publicKey !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
//             console.log('Public key already registered, checking verification status...');
//             const isVerified = await contract.methods.isVoterVerified(account).call();
//             if (isVerified) {
//               console.log('Voter is verified, logging in...');
//               setIsAuthenticated(true);
//             } else {
//               console.error('Voter is not verified by admin.');
//               setMessageType('error');
//               setMessage('You are not verified by the admin. Please contact the admin for verification.');
//             }
//           } else {
//             // Register public key with the contract
//             console.log("Registering public key with the contract...");
//             await contract.methods.registerPublicKey(publicKeyBytes32).send({ from: account, gas: 300000 });
//             console.log('Public key registered, checking verification status...');
//             const isVerified = await contract.methods.isVoterVerified(account).call();
//             if (isVerified) {
//               console.log('Voter is verified, logging in...');
//               setIsAuthenticated(true);
//             } else {
//               console.error('Voter is not verified by admin.');
//               setMessageType('error');
//               setMessage('You are not verified by the admin. Please contact the admin for verification.');
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error requesting accounts or registering public key:', error);
//         setMessageType('error');
//         setMessage('There was an error requesting accounts or registering public key. Please try again.');
//       }
//     } else {
//       setMessageType('error');
//       setMessage('Please install Metamask to use this app.');
//     }
//     setLoading(false);
//   };

//   const handleAdminLogin = () => {
//     navigate('/admin-login');
//   };

//   return (
//     <LoginContainer>
//       <LoginCard>
//         <LoginContent>
//           <Logo src={`${process.env.PUBLIC_URL}/metamask-logo.png`} alt="MetaMask Logo" />
//           <Typography variant="h4" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '700', color: '#240750' }}>
//             Login with MetaMask
//           </Typography>
//           <Typography variant="body1" style={{ marginBottom: '20px', fontFamily: 'Poppins', color: '#240750' }}>
//             Access your blockchain voting account securely with MetaMask.
//             Click the button below to connect your wallet and get started.
//           </Typography>
//           <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap="10px">
//             <LoginButton
//               variant="contained"
//               color="primary"
//               onClick={loginWithMetamask}
//               disabled={loading}
//             >
//               {loading ? <CircularProgress size={24} /> : 'Login'}
//             </LoginButton>
//             <AdminButton
//               variant="contained"
//               onClick={handleAdminLogin}
//             >
//               Admin?
//             </AdminButton>
//           </Box>
//           {message && (
//             <Alert severity={messageType} style={{ marginTop: '20px' }}>
//               {message}
//             </Alert>
//           )}
//         </LoginContent>
//       </LoginCard>
//     </LoginContainer>
//   );
// }

// export default Login;


// import React, { useState, useEffect } from 'react';
// import Web3 from 'web3';
// import { Button, Card, CardContent, Typography, CircularProgress, Container, Box, Alert } from '@mui/material';
// import { styled, css, keyframes } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';
// import CryptoJS from 'crypto-js';
// import VotingSystem from './contracts/VotingSystem.json';
// import { db } from './firebase';
// import { doc, getDoc } from 'firebase/firestore';

// const LoginContainer = styled(Container)(
//   () => css`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     height: 100vh;
//     text-align: center;
//     background-color: #FFFFFF; // light blue background
//     max-width: 1900px !important;
//     width: 100%;
//   `,
// );

// const LoginCard = styled(Card)({
//   padding: '40px 20px',
//   textAlign: 'center',
//   backgroundColor: '#ffffff', // light grey background
//   color: '#240750',
//   boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
// });

// const LoginButton = styled(Button)({
//   marginTop: '20px',
//   padding: '10px 30px',
//   backgroundColor: '#6200ea', // purple color
//   fontSize: '1.1rem',
//   fontWeight: 'bold',
//   color: '#fff',
//   '&:hover': {
//     backgroundColor: '#4a148c', // darker purple on hover
//   },
// });

// const AdminButton = styled(Button)({
//   marginTop: '20px',
//   padding: '10px 30px',
//   backgroundColor: '#9575cd', // lighter purple color
//   fontSize: '1.1rem',
//   fontWeight: 'bold',
//   color: '#fff',
//   '&:hover': {
//     backgroundColor: '#7e57c2', // slightly darker purple on hover
//   },
// });

// const Logo = styled('img')({
//   width: '150px',
//   marginBottom: '20px',
// });

// const fadeIn = keyframes`
//   from {
//     opacity: 0;
//   }
//   to {
//     opacity: 1;
//   }
// `;

// const LoginContent = styled(CardContent)({
//   animation: `${fadeIn} 1s ease-in-out`,
// });

// function Login({ setIsAuthenticated, setAccount }) {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('info');
//   const [results, setResults] = useState(null);
//   const [isElectionActive, setIsElectionActive] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchElectionStatus = async () => {
//       const electionDoc = await getDoc(doc(db, 'election', 'status'));
//       if (electionDoc.exists()) {
//         setIsElectionActive(electionDoc.data().isActive);
//       }
//     };

//     fetchElectionStatus();
//   }, []);

//   useEffect(() => {
//     if (!isElectionActive && !loading) {
//       fetchResults();
//     }
//   }, [isElectionActive, loading]);

//   const loginWithMetamask = async () => {
//     setLoading(true);
//     setMessage('');
//     if (window.ethereum) {
//       const web3 = new Web3(window.ethereum);
//       try {
//         await window.ethereum.request({ method: 'eth_requestAccounts' });
//         const accounts = await web3.eth.getAccounts();
//         if (accounts.length > 0) {
//           const account = accounts[0];
//           setAccount(account);

//           // Generate public key hash
//           const publicKey = CryptoJS.SHA256(account).toString(CryptoJS.enc.Hex);
//           const publicKeyBytes32 = `0x${publicKey.slice(0, 64)}`;
//           console.log("Public Key (bytes32):", publicKeyBytes32);

//           // Get contract instance
//           const networkId = await web3.eth.net.getId();
//           console.log("Network ID:", networkId);
//           const deployedNetwork = VotingSystem.networks[networkId];
//           if (!deployedNetwork) {
//             throw new Error(`Contract not deployed on network with ID ${networkId}`);
//           }

//           const contract = new web3.eth.Contract(
//             VotingSystem.abi,
//             deployedNetwork && deployedNetwork.address
//           );

//           // Check if the public key is already registered
//           const voter = await contract.methods.voters(account).call();
//           if (voter.publicKey !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
//             console.log('Public key already registered, checking verification status...');
//             const isVerified = await contract.methods.isVoterVerified(account).call();
//             if (isVerified) {
//               console.log('Voter is verified, logging in...');
//               setIsAuthenticated(true);
//             } else {
//               console.error('Voter is not verified by admin.');
//               setMessageType('error');
//               setMessage('You are not verified by the admin. Please contact the admin for verification.');
//             }
//           } else {
//             // Register public key with the contract
//             console.log("Registering public key with the contract...");
//             await contract.methods.registerPublicKey(publicKeyBytes32).send({ from: account, gas: 300000 });
//             console.log('Public key registered, checking verification status...');
//             const isVerified = await contract.methods.isVoterVerified(account).call();
//             if (isVerified) {
//               console.log('Voter is verified, logging in...');
//               setIsAuthenticated(true);
//             } else {
//               console.error('Voter is not verified by admin.');
//               setMessageType('error');
//               setMessage('You are not verified by the admin. Please contact the admin for verification.');
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error requesting accounts or registering public key:', error);
//         setMessageType('error');
//         setMessage('There was an error requesting accounts or registering public key. Please try again.');
//       }
//     } else {
//       setMessageType('error');
//       setMessage('Please install Metamask to use this app.');
//     }
//     setLoading(false);
//   };

//   const fetchResults = async () => {
//     const web3 = new Web3(window.ethereum);
//     const networkId = await web3.eth.net.getId();
//     const deployedNetwork = VotingSystem.networks[networkId];
//     const contract = new web3.eth.Contract(
//       VotingSystem.abi,
//       deployedNetwork && deployedNetwork.address
//     );

//     try {
//       const results = await contract.methods.getResults().call();
//       setResults(`${results.winnerName} with ${results.winnerVoteCount} votes`);
//     } catch (error) {
//       console.error('Error fetching results:', error);
//       setMessageType('error');
//       setMessage('Error fetching results. Please try again.');
//     }
//   };

//   const handleAdminLogin = () => {
//     navigate('/admin-login');
//   };

//   return (
//     <LoginContainer>
//       <LoginCard>
//         <LoginContent>
//           <Logo src={`${process.env.PUBLIC_URL}/metamask-logo.png`} alt="MetaMask Logo" />
//           <Typography variant="h4" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '700', color: '#240750' }}>
//             Login with MetaMask
//           </Typography>
//           <Typography variant="body1" style={{ marginBottom: '20px', fontFamily: 'Poppins', color: '#240750' }}>
//             Access your blockchain voting account securely with MetaMask.
//             Click the button below to connect your wallet and get started.
//           </Typography>
//           <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap="10px">
//             <LoginButton
//               variant="contained"
//               color="primary"
//               onClick={loginWithMetamask}
//               disabled={loading}
//             >
//               {loading ? <CircularProgress size={24} /> : 'Login'}
//             </LoginButton>
//             <AdminButton
//               variant="contained"
//               onClick={handleAdminLogin}
//             >
//               Admin?
//             </AdminButton>
//           </Box>
//           {message && (
//             <Alert severity={messageType} style={{ marginTop: '20px' }}>
//               {message}
//             </Alert>
//           )}
//           {results && (
//             <Typography variant="body1" style={{ marginTop: '20px', fontFamily: 'Poppins', color: '#240750' }}>
//               Voting Results: {results}
//             </Typography>
//           )}
//         </LoginContent>
//       </LoginCard>
//     </LoginContainer>
//   );
// }

// export default Login;

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Button, Card, CardContent, Typography, CircularProgress, Container, Box, Alert } from '@mui/material';
import { styled, css, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { CSVLink } from 'react-csv';
import VotingSystem from './contracts/VotingSystem.json';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const LoginContainer = styled(Container)(
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

const LoginCard = styled(Card)({
  padding: '40px 20px',
  textAlign: 'center',
  backgroundColor: '#ffffff',
  color: '#240750',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
});

const LoginButton = styled(Button)({
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

const AdminButton = styled(Button)({
  marginTop: '20px',
  padding: '10px 30px',
  backgroundColor: '#9575cd',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#7e57c2',
  },
});

const VotesDataButton = styled(Button)({
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
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [isElectionActive, setIsElectionActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElectionStatus = async () => {
      const electionDoc = await getDoc(doc(db, 'election', 'status'));
      if (electionDoc.exists()) {
        const isActive = electionDoc.data().isActive;
        setIsElectionActive(isActive);
        if (!isActive) {
          await fetchResults();
          await fetchVotesData();
        }
      }
    };

    fetchElectionStatus();
  }, []);

  const loginWithMetamask = async () => {
    setLoading(true);
    setMessage('');
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

          // Check if the public key is already registered
          const voter = await contract.methods.voters(account).call();
          if (voter.publicKey !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
            console.log('Public key already registered, checking verification status...');
            const isVerified = await contract.methods.isVoterVerified(account).call();
            if (isVerified) {
              console.log('Voter is verified, logging in...');
              setIsAuthenticated(true);
            } else {
              console.error('Voter is not verified by admin.');
              setMessageType('error');
              setMessage('You are not verified by the admin. Please contact the admin for verification.');
            }
          } else {
            // Register public key with the contract
            console.log("Registering public key with the contract...");
            await contract.methods.registerPublicKey(publicKeyBytes32).send({ from: account, gas: 300000 });
            console.log('Public key registered, checking verification status...');
            const isVerified = await contract.methods.isVoterVerified(account).call();
            if (isVerified) {
              console.log('Voter is verified, logging in...');
              setIsAuthenticated(true);
            } else {
              console.error('Voter is not verified by admin.');
              setMessageType('error');
              setMessage('You are not verified by the admin. Please contact the admin for verification.');
            }
          }
        }
      } catch (error) {
        console.error('Error requesting accounts or registering public key:', error);
        setMessageType('error');
        setMessage('There was an error requesting accounts or registering public key. Please try again.');
      }
    } else {
      setMessageType('error');
      setMessage('Please install Metamask to use this app.');
    }
    setLoading(false);
  };

  const fetchResults = async () => {
    const web3 = new Web3(window.ethereum);
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = VotingSystem.networks[networkId];
    const contract = new web3.eth.Contract(
      VotingSystem.abi,
      deployedNetwork && deployedNetwork.address
    );

    try {
      const results = await contract.methods.getResults().call();
      setResults(`${results.winnerName} with ${results.winnerVoteCount} votes`);
    } catch (error) {
      console.error('Error fetching results:', error);
      setMessageType('error');
      setMessage('Error fetching results. Please try again.');
    }
  };

  const fetchVotesData = async () => {
    const web3 = new Web3(window.ethereum);
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = VotingSystem.networks[networkId];
    const contract = new web3.eth.Contract(
      VotingSystem.abi,
      deployedNetwork && deployedNetwork.address
    );

    try {
      const votesArray = await contract.methods.getAllVotes().call();
      const candidate1Votes = parseInt(votesArray[0], 10);
      const candidate2Votes = parseInt(votesArray[1], 10);

      const data = [
        ['Candidate', 'Votes'],
        ['Candidate 1', candidate1Votes],
        ['Candidate 2', candidate2Votes],
      ];
      setCsvData(data);
    } catch (error) {
      console.error('Error fetching votes data:', error);
      setMessageType('error');
      setMessage('Error fetching votes data. Please try again.');
    }
  };

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginContent>
          <Logo src={`${process.env.PUBLIC_URL}/metamask-logo.png`} alt="MetaMask Logo" />
          <Typography variant="h4" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '700', color: '#240750' }}>
            Login with MetaMask
          </Typography>
          <Typography variant="body1" style={{ marginBottom: '20px', fontFamily: 'Poppins', color: '#240750' }}>
            Access your blockchain voting account securely with MetaMask.
            Click the button below to connect your wallet and get started.
          </Typography>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap="10px">
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
          </Box>
          {message && (
            <Alert severity={messageType} style={{ marginTop: '20px' }}>
              {message}
            </Alert>
          )}
          {results && !isElectionActive && (
            <Typography variant="body1" style={{ marginTop: '20px', fontFamily: 'Poppins', color: '#240750' }}>
              Voting Results: {results}
            </Typography>
          )}
          {csvData.length > 0 && !isElectionActive && (
            <Box display="flex" flexDirection="column" alignItems="center" marginTop="20px">
              <VotesDataButton>
                <CSVLink data={csvData} filename={"votes_data.csv"} style={{ textDecoration: 'none', color: '#fff' }}>
                  Download Votes Data
                </CSVLink>
              </VotesDataButton>
            </Box>
          )}
        </LoginContent>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;
