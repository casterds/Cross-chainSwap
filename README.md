## Cross-chain swap using axelar

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Functionalities

- [x] Connect wallet using your metamask 
- [x] Showing native balance
- [x] Mint interface for testing purpose for TokenA & TokenB
- [x] Swap interface for TokenA & TokenB
- [x] Approving selected Token if allowance is not enough
- [x] swapRemote function call with fee calculation
- [x] Showing axlarscan link after swapping is successful

### working
- Prettier & eslint configuration on the project
- Build based on next.js + rainbowkit + tailwind.css to provide wallet connection

# Details for TokenA and TokenB
They are just simple mockERC20 token contract extended from openzeppelin. It has 18 decimals and mint function for testing purpose. and they are deployed on both of chains (Binance smart chain testnet & polygon testnet & Avalanche testnet)

# How swap works
When calling swapRemote function in OracleSwap contract, first of all, the user have to approve the contract to spend the amount of token that user want to swap. Then, the contract will lock the token and send the message to destination chain by calling gateway.callContract function inside swapRemote itself.
On the destination chain, once the gateway is received the message from source chain, it will run _execute function defined in OracleSwap contract. Then, the contract will transfer the token to the user
Additionally, the token prices are defined as static variable in OracleSwap contract.

# Deployed Contracts details : 


# For BSC & Polygon 
BNB Testnet: https://testnet.bscscan.com/address/0x573Df1765F7d85d273F1bdF50377D6695011C416
Polygon Mumbai: https://mumbai.polygonscan.com/address/0x8f62a65851b772491a34cAd28B4E0Ea298e1b6C3


# For BSC & Avalanche 


Binance

A token contract - https://testnet.bscscan.com/address/0xF6C652F272CcF090dcCDdA5caa8de516e6C0A538 
B token contract - https://testnet.bscscan.com/address/0x20a719Bd6aDFeB9CfDcEF958e25ab37622e64893

Avalanche 

A token contract - https://testnet.snowtrace.io/address/0xA5516E15a0B618237D5C77AaF67008324971eF42
B token contract - https://testnet.snowtrace.io/address/0x169b32fC08B5F765BC444B5e8c16eCCDC77A8908
Oracle contract to Swap BSC tokens to Avalanche tokens - https://testnet.snowtrace.io/address/0x9dF5289cd55926A390fa062Cc62eC6ed55f8BA73

BSC to Avalanche swap tx

https://testnet.snowtrace.io/tx/0x2198813a50ea2168f397ac4c8d8dadf641ece87cb85c7c0ffdaa9dee976c134a

Avalanche to BSC swap tx

https://testnet.snowtrace.io/tx/0xfd3869cc214080e940ff2594e2e420a4eaef5a42022cea6a5b066ed7114040e4

