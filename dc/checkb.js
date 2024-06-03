require('dotenv').config();
const { ethers } = require("ethers");

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(API_URL);
  const wallet = new ethers.Wallet(`${PRIVATE_KEY}`, provider);

  const balance = await wallet.getBalance();
  console.log(`Balance: ${ethers.utils.formatEther(balance)} ETH`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});