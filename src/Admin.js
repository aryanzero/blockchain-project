import React, { useState } from 'react';
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

  const fetchVotes = async () => {
    if (contract) {
      const results = await contract.methods.getAllVotes().call();
      setVotes(results);
      setCsvData([
        ['Candidate', 'Votes'],
        ['Aryan', results[0]],
        ['Ansh', results[1]],
      ]);
      setChartData([
        ['Candidate', 'Votes'],
        ['Aryan', results[0]],
        ['Ansh', results[1]],
      ]);
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
          <AdminButton onClick={fetchVotes}>Fetch Votes</AdminButton>
          {votes.length > 0 && (
            <CSVLink data={csvData} filename={"votes_data.csv"} style={{ textDecoration: 'none' }}>
              <AdminButton>Download CSV</AdminButton>
            </CSVLink>
          )}
          {votes.length > 0 && (
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
          )}
        </CardContent>
      </AdminCard>
    </AdminContainer>
  );
}

export default Admin;
