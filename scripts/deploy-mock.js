const { ethers } = require('hardhat')

// You need to compile the contracts first.
// "build": "npm run clean && npm run compile",
// "compile": "hardhat compile",

// The deployer wallet will have 1000 A token and B token for Binance and Avalanche
// $yarn hardhat run scripts/deploy-mock.js --network bscTestnet

// $yarn hardhat run scripts/deploy-mock.js --network avalancheFuji
async function main() {
  const signers = await ethers.getSigners();
  
  const TokenFactory = await ethers.getContractFactory('MockERC20');
  const aTokenFactory = await TokenFactory.deploy("AToken", "AAA");
  await aTokenFactory.deployed();
  
  const bTokenFactory = await TokenFactory.deploy("BToken", "BBB");
  await bTokenFactory.deployed();
  
  console.log("aTokenFactory.address, bTokenFactory.address");
  console.log(aTokenFactory.address, bTokenFactory.address);

  // Mint to test account
  await aTokenFactory.mint(signers[0].address, ethers.utils.parseEther("1000"));
  await bTokenFactory.mint(signers[0].address, ethers.utils.parseEther("1000"));
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
