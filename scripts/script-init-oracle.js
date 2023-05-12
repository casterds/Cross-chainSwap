const { ethers } = require('hardhat')

// We need to use Avalanche instead of Polygon and work with BSC Testnet - Avalanche Testnet
// So, this should be updated according to that or I need to both of it?
// $yarn hardhat run scripts/script-init-oracle.js --network avalancheFuji
// $yarn hardhat run scripts/script-init-ocacle.js --network bscTestnet
async function main() {
  const signers = await ethers.getSigners();

  // It is deployed at and I don't need to deploy it again myself with the opposite direciton?
  // Avalanche to BSC?
  // https://testnet.bscscan.com/address/0x573df1765f7d85d273f1bdf50377d6695011c416
  const BscSwap = "0x573Df1765F7d85d273F1bdF50377D6695011C416";
  // const PolygonSwap = "0x8f62a65851b772491a34cAd28B4E0Ea298e1b6C3";

  // TODO
  // Deploy oracle swap with deploy-oracle-swap and update this
  // BSC to Avalanche
  const AvalancheSwap = "0x9dF5289cd55926A390fa062Cc62eC6ed55f8BA73";

  // const oracleSwapFactory = await ethers.getContractAt("OracleSwap", PolygonSwap);
  const oracleSwapFactory = await ethers.getContractAt("OracleSwap", AvalancheSwap);
  await oracleSwapFactory.setSourceContractAddress(BscSwap);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
