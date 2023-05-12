const { ethers } = require('hardhat')

// We need to use Avalanche instead of Polygon 
// So, this should be updated according to that

// $yarn hardhat run scripts/deploy-oracle-swap.js --network avalancheFuji
// $yarn hardhat run scripts/deploy-mock.js --network bscTestnet?
async function main() {
  const signers = await ethers.getSigners();

  // const Gateway = '0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B'; // Polygon
  // const GasReceiver = '0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6'; // Polygon

  const Gateway = '0xC249632c2D40b9001FE907806902f63038B737Ab'; // Avalanche
  // I need to find this https://docs.axelar.dev/dev/general-message-passing/gas-services/intro#gas-receiver
  // Is what needed
  // Should use addresses here? https://docs.axelar.dev/dev/reference/testnet-contract-addresses
  const GasReceiver = '0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6'; // Avalanche

  // TODO
  // Confirm that these are deployed to the BSC testnet at least or deploy myself and update also?
  const BscAToken = '0xF6C652F272CcF090dcCDdA5caa8de516e6C0A538'; // BSC
  const BscBToken = '0x20a719Bd6aDFeB9CfDcEF958e25ab37622e64893'; // BSC

  // const PolygonAToken = '0x53A4C2f5f3105eEa5db142618D9c9186c81436E3'; // Polygon
  // const PolygonBToken = '0xa5262597eC048E640544ea550834F3F958CbF38E'; // Polygon

  // Deploy the token to the Avalanche and update this.
  const AvalancheAToken = '0xA5516E15a0B618237D5C77AaF67008324971eF42'; // Avalanche
  const AvalancheBToken = '0x169b32fC08B5F765BC444B5e8c16eCCDC77A8908'; // Avalanche

  const OracleSwapFactory = await ethers.getContractFactory('OracleSwap');
  // const oracleSwapFactory = await OracleSwapFactory.deploy(Gateway, GasReceiver, PolygonAToken, PolygonBToken, BscAToken, BscBToken);
  const oracleSwapFactory = await OracleSwapFactory.deploy(Gateway, GasReceiver, AvalancheAToken, AvalancheBToken, BscAToken, BscBToken);
  await oracleSwapFactory.deployed();

  console.log("oracleSwapFactory.address");
  console.log(oracleSwapFactory.address);

  // Add initial liquidity
  // const aTokenFactory = await ethers.getContractAt("MockERC20", PolygonAToken);
  // const bTokenFactory = await ethers.getContractAt("MockERC20", PolygonBToken);
  
  // Add initial liquidity
  const aTokenFactory = await ethers.getContractAt("MockERC20", AvalancheAToken);
  const bTokenFactory = await ethers.getContractAt("MockERC20", AvalancheBToken);

  await aTokenFactory.mint(oracleSwapFactory.address, ethers.utils.parseEther("100000"));
  await bTokenFactory.mint(oracleSwapFactory.address, ethers.utils.parseEther("100000"));
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
