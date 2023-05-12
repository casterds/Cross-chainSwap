const { AxelarQueryAPI, CHAINS, Environment } = require('@axelar-network/axelarjs-sdk');

function calculateBridgeFee(source, destination, sourceTokenSymbol, options = {}) {
  const api = new AxelarQueryAPI({ environment: Environment.TESTNET });
  const { gasLimit, gasMultiplier } = options;

  return api.estimateGasFee(
      CHAINS.TESTNET[source.toUpperCase()],
      CHAINS.TESTNET[destination.toUpperCase()],
      sourceTokenSymbol,
      400000,
      gasMultiplier,
  );
}

module.exports = {
  calculateBridgeFee,
};
