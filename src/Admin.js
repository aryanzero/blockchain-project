import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Card, CardContent } from '@mui/material';
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
    background-color: #f5f5f5; // Light gray background
    padding: 20px;
    max-width: 1900px !important;
    width: 100%;
  `,
);

const AdminCard = styled(Card)({
  width: '100%',
  maxWidth: 600,
  textAlign: 'center',
  backgroundColor: '#ffffff', // White background
  color: '#333', // Dark text color
  padding: '30px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  marginBottom: '20px',
});

const AdminButton = styled(Button)({
  marginTop: '10px',
  padding: '10px 20px',
  backgroundColor: '#4a148c', // Darker purple color
  fontSize: '1rem',
  fontWeight: 'bold',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#38006b', // Even darker purple on hover
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

function Admin({ account, contract }) {
  const [votes, setVotes] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [candidateNames, setCandidateNames] = useState(['Candidate 1', 'Candidate 2']);
  const [loading, setLoading] = useState(false);
  const [isElectionActive, setIsElectionActive] = useState(false);

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
          console.log("Fetching candidate names...");
          const name1 = await contract.methods.candidates(0).call();
          const name2 = await contract.methods.candidates(1).call();
          setCandidateNames([name1.name, name2.name]);
          console.log("Fetched candidate names:", name1.name, name2.name);
        } catch (error) {
          console.error("Error fetching candidate names:", error);
        }
      } else {
        console.log("Contract is not defined");
      }
    };
    fetchCandidateNames();
  }, [contract]);

  const fetchVotes = async () => {
    if (contract) {
      setLoading(true);
      try {
        console.log("Fetching votes...");
        const votesArray = await contract.methods.getAllVotes().call();
        console.log("Fetched votes:", votesArray);
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
        console.log("Error details:", error.message);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Contract is not defined");
    }
  };

  const toggleElectionStatus = async () => {
    const newStatus = !isElectionActive;
    setIsElectionActive(newStatus);
    await updateDoc(doc(db, 'election', 'status'), {
      isActive: newStatus,
    });
  };

  return (
    <AdminContainer>
      <Typography variant="h3" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '700', color: '#240750' }}>
        Admin Panel
      </Typography>
      <AdminCard>
        <CardContent>
          <Typography variant="h5" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '600' }}>
            Election Control
          </Typography>
          <AdminButton onClick={toggleElectionStatus}>
            {isElectionActive ? 'Stop Election' : 'Start Election'}
          </AdminButton>
          <Typography variant="h5" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '600', marginTop: '20px' }}>
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
                      { color: '#9575cd' }, // Dark purple for candidate 1
                      { color: '#4a148c' }, // Darker purple for candidate 2
                    ],
                  }}
                />
              </ChartContainer>
            </>
          )}
        </CardContent>
      </AdminCard>
    </AdminContainer>
  );
}

export default Admin;
