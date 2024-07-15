import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Card, CardContent, Tabs, Tab, Box, List, ListItem, ListItemText } from '@mui/material';
import { styled, css } from '@mui/material/styles';
import { CSVLink } from 'react-csv';
import { Chart } from 'react-google-charts';
import { db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const AdminContainer = styled(Container)(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    background-color: #f5f5f5;
    padding: 20px;
    max-width: 1900px !important;
    width: 100%;
  `,
);

const AdminCard = styled(Card)({
  width: '100%',
  maxWidth: 600,
  textAlign: 'center',
  backgroundColor: '#ffffff',
  color: '#333',
  padding: '30px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  marginBottom: '20px',
});

const AdminButton = styled(Button)({
  marginTop: '10px',
  padding: '10px 20px',
  backgroundColor: '#4a148c',
  fontSize: '1rem',
  fontWeight: 'bold',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#38006b',
  },
});

const ButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  marginTop: '20px',
});

const ChartContainer = styled('div')({
  marginTop: '20px',
  width: '100%',
  maxWidth: '600px',
});

const StyledTabs = styled(Tabs)({
  backgroundColor: '#f0f0f0',
  borderRadius: '8px',
  marginBottom: '20px',
  '& .MuiTab-root': {
    color: '#000',
  },
  '& .Mui-selected': {
    color: '#4a148c',
    fontWeight: 'bold',
  },
});

const FullWidthListItemText = styled(ListItemText)({
  wordWrap: 'break-word',
  fontWeight: 'bold', // Make the font bold
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add box shadow
  padding: '10px', // Add padding for better spacing
  borderRadius: '8px', // Add border radius for rounded corners
});

function Admin({ account, contract }) {
  const [votes, setVotes] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [candidateNames, setCandidateNames] = useState(['Candidate 1', 'Candidate 2']);
  const [loading, setLoading] = useState(false);
  const [isElectionActive, setIsElectionActive] = useState(false);
  const [voters, setVoters] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const fetchElectionStatus = async () => {
      const electionDoc = await getDoc(doc(db, 'election', 'status'));
      if (electionDoc.exists()) {
        setIsElectionActive(electionDoc.data().isActive);
      }
    };

    fetchElectionStatus();
  }, []);

  useEffect(() => {
    const fetchCandidateNames = async () => {
      if (contract) {
        try {
          const name1 = await contract.methods.candidates(0).call();
          const name2 = await contract.methods.candidates(1).call();
          setCandidateNames([name1.name, name2.name]);
        } catch (error) {
          console.error("Error fetching candidate names:", error);
        }
      }
    };
    fetchCandidateNames();
  }, [contract]);

  const fetchVotes = async () => {
    if (contract) {
      setLoading(true);
      try {
        const votesArray = await contract.methods.getAllVotes().call();
        const candidate1Votes = parseInt(votesArray[0], 10);
        const candidate2Votes = parseInt(votesArray[1], 10);
        setVotes([candidate1Votes, candidate2Votes]);

        const data = [
          ['Candidate', 'Votes'],
          [candidateNames[0], candidate1Votes],
          [candidateNames[1], candidate2Votes],
        ];
        setCsvData(data);
        setChartData(data);
      } catch (error) {
        console.error("Error fetching votes:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchVoters = async () => {
    if (contract) {
      setLoading(true);
      try {
        const addresses = await contract.methods.getVoterAddresses().call();
        const publicKeys = await contract.methods.getVoterPublicKeys().call();
        const verifications = await contract.methods.getVoterVerifications().call();
        
        const voters = addresses.map((address, index) => ({
          address,
          publicKey: publicKeys[index],
          isVerifiedByAdmin: verifications[index],
        }));
        setVoters(voters);
        console.log("Fetched voters:", voters);
      } catch (error) {
        console.error("Error fetching voters:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const verifyVoter = async (voterAddress) => {
    if (contract) {
      setLoading(true);
      try {
        await contract.methods.verifyVoter(voterAddress).send({ from: account });
        const updatedVoters = voters.map((voter) =>
          voter.address === voterAddress ? { ...voter, isVerifiedByAdmin: true } : voter
        );
        setVoters(updatedVoters);
      } catch (error) {
        console.error("Error verifying voter:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleElectionStatus = async () => {
    const newStatus = !isElectionActive;
    setIsElectionActive(newStatus);
    await updateDoc(doc(db, 'election', 'status'), {
      isActive: newStatus,
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <AdminContainer>
      <Typography variant="h3" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '700', color: '#240750' }}>
        Admin Panel
      </Typography>
      <StyledTabs value={tabIndex} onChange={handleTabChange} variant="fullWidth" centered>
        <Tab label="Election Control" />
        <Tab label="Download Votes Data" />
        <Tab label="Registered Voters" />
      </StyledTabs>
      <AdminCard>
        <CardContent>
          {tabIndex === 0 && (
            <>
              <Typography variant="h5" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '600' }}>
                Election Control
              </Typography>
              <AdminButton onClick={toggleElectionStatus}>
                {isElectionActive ? 'Stop Election' : 'Start Election'}
              </AdminButton>
            </>
          )}
          {tabIndex === 1 && (
            <>
              <Typography variant="h5" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '600' }}>
                Download Votes Data
              </Typography>
              <ButtonContainer>
                <AdminButton onClick={fetchVotes} disabled={loading}>
                  {loading ? "Fetching Votes..." : "Fetch Votes"}
                </AdminButton>
                {votes.length > 0 && (
                  <CSVLink data={csvData} filename={"votes_data.csv"} style={{ textDecoration: 'none' }}>
                    <AdminButton>Download CSV</AdminButton>
                  </CSVLink>
                )}
              </ButtonContainer>
              {votes.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '600', marginTop: '20px' }}>
                    Total Votes: {votes.reduce((acc, count) => acc + count, 0)}
                  </Typography>
                  <ChartContainer>
                    <Chart
                      width={'100%'}
                      height={'400px'}
                      chartType="PieChart"
                      loader={<div>Loading Chart...</div>}
                      data={chartData}
                      options={{
                        title: 'Votes Distribution',
                        pieHole: 0.4,
                        is3D: false,
                        backgroundColor: '#ffffff',
                        legendTextStyle: { color: '#333' },
                        titleTextStyle: { color: '#333' },
                        slices: [
                          { color: '#9575cd' },
                          { color: '#4a148c' },
                        ],
                      }}
                    />
                  </ChartContainer>
                </>
              )}
            </>
          )}
          {tabIndex === 2 && (
            <>
              <Typography variant="h5" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '600' }}>
                Registered Voters
              </Typography>
              <AdminButton onClick={fetchVoters} disabled={loading}>
                {loading ? "Fetching Voters..." : "Fetch Voters"}
              </AdminButton>
              {voters.length > 0 && (
                <List>
                  {voters.map((voter) => (
                    <ListItem key={voter.address} sx={{ display: 'flex', alignItems: 'center' }}>
                      <FullWidthListItemText primary={`${voter.publicKey} ${voter.isVerifiedByAdmin ? '(Verified)' : '(Not Verified)'}`} />
                      {!voter.isVerifiedByAdmin && (
                        <Box sx={{ marginLeft: '20px' }}> {/* Add space between public key and verify button */}
                          <AdminButton onClick={() => verifyVoter(voter.address)} disabled={loading}>
                            Verify
                          </AdminButton>
                        </Box>
                      )}
                    </ListItem>
                  ))}
                </List>
              )}
            </>
          )}
        </CardContent>
      </AdminCard>
    </AdminContainer>
  );
}

export default Admin;
