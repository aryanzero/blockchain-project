/* global BigInt */
import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Container, Grid, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { styled, css, keyframes } from '@mui/material/styles';
import Avatar from 'react-avatar';
import CryptoJS from 'crypto-js';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const rotateRWB = keyframes`
  0% { background-position: 0em 0em; }
  100% { background-position: 100em 100em; }
`;

const VotingContainer = styled(Container)(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    background-color: #e3f2fd; // light blue background
    padding: 20px;
    position: relative;
    max-width: 1900px !important;
    width: 100%;
  `,
);

const HeaderContainer = styled(Box)({
  textAlign: 'center',
  marginBottom: '30px',
  color: '#240750', // dark purple color
});

const TimerBox = styled(Box)({
  position: 'relative',
  top: '10px',
  margin: '20px 0',
  backgroundColor: '#240750', // dark purple color
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '5px',
  fontSize: '1.2rem',
  display: 'inline-block',
});

const VotingCard = styled(Card)({
  width: '100%',
  maxWidth: 800,
  textAlign: 'center',
  backgroundColor: '#ffffff', // white background
  color: '#240750', // text color
  padding: '20px',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
  marginBottom: '20px',
});

const VoteButton = styled(Button)({
  marginTop: '10px',
  padding: '10px 20px',
  backgroundColor: '#6200ea', // purple color
  fontSize: '1rem',
  fontWeight: 'bold',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#4a148c', // darker purple on hover
  },
});

const CandidateAvatar = styled(Avatar)({
  width: '80px',
  height: '80px',
  marginBottom: '10px',
  bgColor: '#e6e6fa', // very light purple color
});

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const VotingContent = styled(CardContent)({
  animation: `${fadeIn} 1s ease-in-out`,
});

const CtaButton = styled('a')({
  fontFamily: "'Work Sans', sans-serif",
  textTransform: 'uppercase',
  border: '1px solid #3498db',
  borderRadius: '3px',
  display: 'inline-block',
  padding: '.5em 1em',
  lineHeight: '1em',
  textDecoration: 'none',
  color: '#3498db',
  marginLeft: '1em',
  background: '#fff',
  transition: '.3s all ease-in-out',
  '&:hover': {
    backgroundColor: '#3498db',
    color: '#fff',
  },
});

const StrongText = styled('strong')({
  fontFamily: "'Work Sans', sans-serif",
  textTransform: 'uppercase',
  fontWeight: 900,
  letterSpacing: '1em',
  marginLeft: '2em',
  color: '#3498db',
});

const AnimatedHeading = styled('h1')({
  fontFamily: "'Shrikhand', cursive",
  margin: 0,
  fontSize: 'calc(800% + 1vmin)',
  lineHeight: '110%',
  padding: '0 1em',
  background: '#240750',
  background: 'linear-gradient(to bottom, #e6e6fa 0%, #e6e6fa 33%, #fff 33%, #fff 66%, #240750 66%, #240750 100%)',
  backgroundRepeat: 'repeat',
  backgroundSize: '100% 100%',
  color: 'transparent',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  animation: `${rotateRWB} 100s linear 1s infinite`,
});

function Voting({ account, contract }) {
  const [candidate1, setCandidate1] = useState({ name: 'Aryan', voteCount: 0 });
  const [candidate2, setCandidate2] = useState({ name: 'Ansh', voteCount: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(86400); // 24 hours in seconds
  const [votingEnded, setVotingEnded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [votingProof, setVotingProof] = useState('');
  const [isElectionActive, setIsElectionActive] = useState(false);

  useEffect(() => {
    async function loadElectionStatus() {
      const electionDoc = await getDoc(doc(db, 'election', 'status'));
      if (electionDoc.exists()) {
        setIsElectionActive(electionDoc.data().isActive);
      }
    }

    loadElectionStatus();
  }, []);

  useEffect(() => {
    async function loadVoterData() {
      if (contract) {
        const voter = await contract.methods.voters(account).call();
        setPublicKey(voter.publicKey);
        setHasVoted(voter.hasVoted);
        setVotingProof(voter.proof);
      }
    }

    async function loadCandidateData() {
      if (contract) {
        const candidate1 = await contract.methods.candidates(0).call();
        setCandidate1({ name: candidate1.name, voteCount: candidate1.voteCount });

        const candidate2 = await contract.methods.candidates(1).call();
        setCandidate2({ name: candidate2.name, voteCount: candidate2.voteCount });
      }
    }

    loadVoterData();
    loadCandidateData();
  }, [contract, account]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setVotingEnded(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const generateProof = (candidateId) => {
    // Simulate proof generation
    const proof = CryptoJS.SHA256(`proof${candidateId}`).toString(CryptoJS.enc.Hex);
    return `0x${proof}`;
  };

  const encryptVote = (candidateId) => {
    // Simulate vote encryption
    const encryptedVote = CryptoJS.AES.encrypt(`vote${candidateId}`, 'secret-key').toString();
    const encryptedVoteHash = CryptoJS.SHA256(encryptedVote).toString(CryptoJS.enc.Hex);
    return `0x${encryptedVoteHash}`;
  };

  const vote = async (candidateId) => {
    if (!isElectionActive) {
      setErrorMessage("Voting has not been started yet");
      return;
    }
    if (votingEnded) {
      setErrorMessage("Voting has ended");
      return;
    }
    try {
      const encryptedVote = encryptVote(candidateId);
      const proof = generateProof(candidateId);

      await contract.methods.vote(candidateId, encryptedVote, proof).send({ from: account });

      const candidate1 = await contract.methods.candidates(0).call();
      setCandidate1({ name: candidate1.name, voteCount: candidate1.voteCount });

      const candidate2 = await contract.methods.candidates(1).call();
      setCandidate2({ name: candidate2.name, voteCount: candidate2.voteCount });

      const voter = await contract.methods.voters(account).call();
      setHasVoted(voter.hasVoted);
      setVotingProof(voter.proof); // Set the proof after voting
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleClose = () => {
    setErrorMessage('');
  };

  const downloadPublicKey = () => {
    const element = document.createElement('a');
    const file = new Blob([publicKey], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'public_key.txt';
    document.body.appendChild(element);
    element.click();
  };

  const verifyVote = () => {
    const { p, G, q } = getEllipticCurveParams();
    const Y = calculateY(publicKey);
    const V = getV(votingProof);
    const s0 = getS0(votingProof);
    const s1 = getS1(votingProof);
    const e0 = getE0(votingProof);
    const e1 = getE1(votingProof);
    const R0 = getR0(votingProof);
    const R1 = getR1(votingProof);

    if (V && s0 && s1 && e0 && e1 && R0 && R1) {
      const valid = (s0 * Y === R0 - e0 * V) && (s1 * Y === R1 - e1 * (V - G)) && ((e0 + e1) % q === keccak256(R0, R1, publicKey));

      if (valid == 'False') {
        alert('Vote verified failed!');
      } 
    } else {
      alert('Vote verified successfully!');
    }
  };

  const getEllipticCurveParams = () => {
    return {
      p: BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F'),
      G: BigInt('0x0479BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8'),
      q: BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBAAEDCE6AF48A03BBFD25E8CD0364141'),
    };
  };

  const calculateY = (publicKey) => {
    // Mock calculation for Y based on public keys
    return BigInt(`0x${publicKey.replace(/^0x/, '')}`);
  };

  const getV = (proof) => {
    // Mock extraction of V from proof
    return proof && proof.V ? BigInt(`0x${proof.V.replace(/^0x/, '')}`) : null;
  };

  const getS0 = (proof) => {
    // Mock extraction of s0 from proof
    return proof && proof.s0 ? BigInt(`0x${proof.s0.replace(/^0x/, '')}`) : null;
  };

  const getS1 = (proof) => {
    // Mock extraction of s1 from proof
    return proof && proof.s1 ? BigInt(`0x${proof.s1.replace(/^0x/, '')}`) : null;
  };

  const getE0 = (proof) => {
    // Mock extraction of e0 from proof
    return proof && proof.e0 ? BigInt(`0x${proof.e0.replace(/^0x/, '')}`) : null;
  };

  const getE1 = (proof) => {
    // Mock extraction of e1 from proof
    return proof && proof.e1 ? BigInt(`0x${proof.e1.replace(/^0x/, '')}`) : null;
  };

  const getR0 = (proof) => {
    // Mock extraction of R0 from proof
    return proof && proof.R0 ? BigInt(`0x${proof.R0.replace(/^0x/, '')}`) : null;
  };

  const getR1 = (proof) => {
    // Mock extraction of R1 from proof
    return proof && proof.R1 ? BigInt(`0x${proof.R1.replace(/^0x/, '')}`) : null;
  };

  const keccak256 = (...args) => {
    // Mock Keccak256 hash calculation
    return CryptoJS.SHA256(args.join('')).toString(CryptoJS.enc.Hex);
  };

  return (
    <VotingContainer>
      <HeaderContainer>
        
        <AnimatedHeading>Vote</AnimatedHeading>
          
        <Typography variant="h3" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '700', color: '#240750' }}>
          Welcome to Blockchain Voting App
        </Typography>
        <Typography variant="h6" style={{ fontFamily: 'Poppins', color: '#240750' }}>
          Your public key: {publicKey}
        </Typography>
        <Button variant="contained" onClick={downloadPublicKey} style={{ margin: '10px', backgroundColor: '#240750', color: '#fff' }}>
          Download Public Key
        </Button>
        {hasVoted && (
          <Button variant="contained" onClick={verifyVote} style={{ margin: '10px', backgroundColor: '#240750', color: '#fff' }}>
            Verify Vote
          </Button>
        )}
      </HeaderContainer>

      <VotingCard>
        <VotingContent>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <CandidateAvatar name={candidate1.name} round={true} size="80" color="#e6e6fa" />
              <Typography variant="h5" style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#240750' }}>
                {candidate1.name}
              </Typography>
              <Typography variant="body1" style={{ fontFamily: 'Poppins', color: '#240750', marginBottom: '10px' }}>
                {candidate1.voteCount} votes
              </Typography>
              {!hasVoted && !votingEnded && (
                <VoteButton onClick={() => vote(0)}>Vote for {candidate1.name}</VoteButton>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <CandidateAvatar name={candidate2.name} round={true} size="80" color="#e6e6fa" />
              <Typography variant="h5" style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#240750' }}>
                {candidate2.name}
              </Typography>
              <Typography variant="body1" style={{ fontFamily: 'Poppins', color: '#240750', marginBottom: '10px' }}>
                {candidate2.voteCount} votes
              </Typography>
              {!hasVoted && !votingEnded && (
                <VoteButton onClick={() => vote(1)}>Vote for {candidate2.name}</VoteButton>
              )}
            </Grid>
          </Grid>
          {hasVoted && (
            <>
              <Typography variant="h6" style={{ fontFamily: 'Poppins', color: '#240750', marginTop: '20px' }}>
                Thank you for voting!
              </Typography>
              <Typography variant="body1" style={{ fontFamily: 'Poppins', color: '#240750', marginTop: '10px' }}>
                Your voting proof: {votingProof}
              </Typography>
            </>
          )}
        </VotingContent>
      </VotingCard>

      <Dialog open={!!errorMessage} onClose={handleClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">OK</Button>
        </DialogActions>
      </Dialog>
    </VotingContainer>
  );
}

export default Voting;
