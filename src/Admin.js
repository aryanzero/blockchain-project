import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CSVLink } from 'react-csv';
import { Chart } from 'react-google-charts';

const AdminContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
  backgroundColor: '#121212',
  padding: '20px',
});

const AdminCard = styled(Card)({
  width: '100%',
  maxWidth: 800,
  textAlign: 'center',
  backgroundColor: '#1e1e1e',
  color: '#fff',
  padding: '20px',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
  marginBottom: '20px',
});

const AdminButton = styled(Button)({
  marginTop: '10px',
  padding: '10px 20px',
  backgroundColor: '#f6851b',
  fontSize: '1rem',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#e57c04',
    color: '#fff',
  },
});

function Admin({ account, contract }) {
  const [votes, setVotes] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [candidateNames, setCandidateNames] = useState(['Candidate 1', 'Candidate 2']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCandidateNames = async () => {
      if (contract) {
        try {
          const name1 = await contract.methods.candidates(0).call();
          const name2 = await contract.methods.candidates(1).call();
          setCandidateNames([name1.name, name2.name]);
          console.log("Fetched candidate names:", name1.name, name2.name);
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
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AdminContainer>
      <Typography variant="h3" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '700' }}>
        Admin Panel
      </Typography>
      <AdminCard>
        <CardContent>
          <Typography variant="h5" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '600' }}>
            Download Votes Data
          </Typography>
          <AdminButton onClick={fetchVotes} disabled={loading}>
            {loading ? "Fetching Votes..." : "Fetch Votes"}
          </AdminButton>
          {votes.length > 0 && (
            <>
              <CSVLink data={csvData} filename={"votes_data.csv"} style={{ textDecoration: 'none' }}>
                <AdminButton>Download CSV</AdminButton>
              </CSVLink>
              <Typography variant="h6" gutterBottom style={{ fontFamily: 'Poppins', fontWeight: '600', marginTop: '20px' }}>
                Total Votes: {votes.reduce((acc, count) => acc + count, 0)}
              </Typography>
              <div style={{ marginTop: '20px' }}>
                <Chart
                  width={'600px'}
                  height={'400px'}
                  chartType="PieChart"
                  loader={<div>Loading Chart...</div>}
                  data={chartData}
                  options={{
                    title: 'Votes Distribution',
                    pieHole: 0.4,
                    is3D: false,
                    backgroundColor: '#1e1e1e',
                    legendTextStyle: { color: '#fff' },
                    titleTextStyle: { color: '#fff' },
                  }}
                />
              </div>
            </>
          )}
        </CardContent>
      </AdminCard>
    </AdminContainer>
  );
}

export default Admin;