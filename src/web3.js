const Web3 = require('web3');

// Replace with your own contract ABI and address
const contractABI = [];
const contractAddress = 'YOUR_CONTRACT_ADDRESS';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545'); // You can replace this with your own provider if needed
const votingContract = new web3.eth.Contract(contractABI, contractAddress);

// Function to cast a vote
async function castVote(candidateId) {
    try {
        const accounts = await web3.eth.getAccounts();
        await votingContract.methods.vote(candidateId).send({ from: accounts[0] });
        console.log('Vote cast successfully');
    } catch (error) {
        console.error('Error casting vote:', error);
    }
}

// Function to get the voting results
async function getResults() {
    try {
        const result = await votingContract.methods.getResults().call();
        console.log('Voting results:', result);
        return result;
    } catch (error) {
        console.error('Error getting results:', error);
    }
}

// Example usage
async function main() {
    // Cast a vote for candidate 0
    await castVote(0);

    // Get the voting results
    const results = await getResults();
    console.log(`Winner: ${results.winnerName} with ${results.winnerVoteCount} votes`);
}

main();
