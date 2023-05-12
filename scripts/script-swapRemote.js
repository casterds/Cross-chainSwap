const { ethers } = require('hardhat')
const { calculateBridgeFee } = require("./libs/utils");

// Final phase, if this script works, everything was fine
// We need to use Avalanche instead of Polygon and work with BSC Testnet - Avalanche Testnet
// So, this should be updated according to that
// BSC - Avalanche
// $yarn hardhat run scripts/script-swapRemote.js --network bscTestnet
// $yarn hardhat run scripts/script-swapRemote.js --network avalancheFuji
async function main() {
  const signers = await ethers.getSigners();

  // TODO
  // See if they were deployed at the BNB testnet least and update if necessary
  const BscSwap = "0x573Df1765F7d85d273F1bdF50377D6695011C416";
  // TODO
  // Deploy and update the address
  const AvalancheSwap = "0x9dF5289cd55926A390fa062Cc62eC6ed55f8BA73";
  
  // TODO
  // Test these were deployed to the BSC testnet or deploy myself at least
  const BscAToken = '0xF6C652F272CcF090dcCDdA5caa8de516e6C0A538'; // BSC
  const BscBToken = '0x20a719Bd6aDFeB9CfDcEF958e25ab37622e64893'; // BSC

  // TODO
  // Deploy the tokens and update this
  const AvalancheAToken = '0xA5516E15a0B618237D5C77AaF67008324971eF42'; // Avalanche
  const AvalancheBToken = '0x169b32fC08B5F765BC444B5e8c16eCCDC77A8908'; // Avalanche

  // Both scripts to below should work

  // -- BSC to Avalanche --
  // This worked with the command below.
  // $yarn hardhat run scripts/script-swapRemote.js --network avalancheFuji
  // You can find the tx at https://testnet.snowtrace.io/tx/0x2198813a50ea2168f397ac4c8d8dadf641ece87cb85c7c0ffdaa9dee976c134a
  // const oracleSwapFactory = await ethers.getContractAt("OracleSwap", BscSwap);
  // const aTokenFactory = await ethers.getContractAt("MockERC20", BscAToken);
  // const approveTx = await aTokenFactory.approve(oracleSwapFactory.address, ethers.utils.parseEther("10")); // approve 10 AToken to Oracle Swap Contract
  // await approveTx.wait();
  // const fee = await calculateBridgeFee("Binance", "Avalanche", "BNB");
  // console.log("fee");
  // console.log(fee);
  // const swapTx = await oracleSwapFactory.swapRemote("Avalanche", AvalancheSwap, BscAToken, BscBToken, ethers.utils.parseEther("10"), {
  //   value: fee,
  // }); // swap 10 AToken to BToken
  // console.log("swapTx.hash");
  // console.log(swapTx.hash);
  // await swapTx.wait();

  // -- Avalanche to BSC --
  // This also worked with the command below.
  // $yarn hardhat run scripts/script-swapRemote.js --network avalancheFuji
  // You can find the tx at https://testnet.snowtrace.io/tx/0xfd3869cc214080e940ff2594e2e420a4eaef5a42022cea6a5b066ed7114040e4
  // const oracleSwapFactory = await ethers.getContractAt("OracleSwap", AvalancheSwap);
  // const aTokenFactory = await ethers.getContractAt("MockERC20", AvalancheAToken);
  // const approveTx = await aTokenFactory.approve(oracleSwapFactory.address, ethers.utils.parseEther("10")); // approve 10 AToken to Oracle Swap Contract
  // await approveTx.wait();
  // const fee = await calculateBridgeFee("Avalanche", "Binance", "AVAX");
  // console.log("fee");
  // console.log(fee);
  // const swapTx = await oracleSwapFactory.swapRemote("Binance", BscSwap, AvalancheAToken, AvalancheBToken, ethers.utils.parseEther("10"), {
  //   value: fee,
  // }); // swap 10 AToken to BToken
  // console.log("swapTx.hash");
  // console.log(swapTx.hash);
  // await swapTx.wait();

  // 158544869565165870
  // 0xfd3869cc214080e940ff2594e2e420a4eaef5a42022cea6a5b066ed7114040e4
}


// BSC - Polygon
// async function main() {
//   const signers = await ethers.getSigners();

//   const BscSwap = "0x573Df1765F7d85d273F1bdF50377D6695011C416";
//   // const PolygonSwap = "0x8f62a65851b772491a34cAd28B4E0Ea298e1b6C3";
  
//   const BscAToken = '0xb5e94535C70264DAd3e9dEeEC91765792AAe408F'; // BSC
//   const BscBToken = '0x6ddFf89EcC27208582be68b3f91e0B1AF6686A59'; // BSC
//   const PolygonAToken = '0x53A4C2f5f3105eEa5db142618D9c9186c81436E3'; // Polygon
//   const PolygonBToken = '0xa5262597eC048E640544ea550834F3F958CbF38E'; // Polygon

//   // -- BSC to Polygon --
//   const oracleSwapFactory = await ethers.getContractAt("OracleSwap", BscSwap);
//   const aTokenFactory = await ethers.getContractAt("MockERC20", BscAToken);
//   const approveTx = await aTokenFactory.approve(oracleSwapFactory.address, ethers.utils.parseEther("10")); // approve 10 AToken to Oracle Swap Contract
//   await approveTx.wait();
//   const fee = await calculateBridgeFee("Binance", "Polygon", "BNB");
//   const swapTx = await oracleSwapFactory.swapRemote("Polygon", PolygonSwap, BscAToken, BscBToken, ethers.utils.parseEther("10"), {
//     value: fee,
//   }); // swap 10 AToken to BToken
//   console.log(swapTx.hash);
//   await swapTx.wait();

//   // -- Polygon to BSC --
//   // const oracleSwapFactory = await ethers.getContractAt("OracleSwap", PolygonSwap);
//   // const aTokenFactory = await ethers.getContractAt("MockERC20", PolygonAToken);
//   // const approveTx = await aTokenFactory.approve(oracleSwapFactory.address, ethers.utils.parseEther("10")); // approve 10 AToken to Oracle Swap Contract
//   // await approveTx.wait();
//   // const fee = await calculateBridgeFee("Polygon", "Binance", "MATIC");
//   // console.log(fee);
//   // const swapTx = await oracleSwapFactory.swapRemote("Binance", BscSwap, PolygonAToken, PolygonBToken, ethers.utils.parseEther("10"), {
//   //   value: fee,
//   // }); // swap 10 AToken to BToken
//   // console.log(swapTx.hash);
//   // await swapTx.wait();
// }

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
