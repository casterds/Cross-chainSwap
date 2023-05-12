/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAccount, useContractRead, useContractWrite, useNetwork, useSwitchNetwork, useWaitForTransaction, useWalletClient } from "wagmi";
import { AxelarQueryAPI, Environment, EvmChain, GasToken } from "@axelar-network/axelarjs-sdk";
import { BigNumber, ethers } from "ethers";
import { createBigInt } from "@metamask/utils";
import Dropdown, { Item } from "./Dropdown";
import {
  ATOKEN_ADDRESS,
  BTOKEN_ADDRESS,
  networkOptions,
  ORACLE_SWAP_ADDRESS,
  tokenOptionsBinance,
  tokenOptionsPolygon,
  tokenOptionsAvalanche,
} from "../utils/constant";
import { SUPPORT_CHAIN_IDS } from "../utils/enums";
import ORACLE_SWAP_ABI from "../utils/abis/OracleSwap.json";
import ERC20_ABI from "../utils/abis/ERC20.json";

// It should work with Binance to Avalanche and Polygon
// It is not more binary option between Binance <-> Avalanche or Binance <-> Polygon only therefore, we should include
// If statements or switch to handle all use cases we need.
const SwapSection = () => {
  
  const [amount, setAmount] = useState(0);
  const [swapping, setSwapping] = useState(false);
  const [sourceToken, setSourceToken] = useState<Item>(tokenOptionsBinance[0]);

  // networkOptions[0] - Polygon Testnet
  // networkOptions[1] - Binance Testnet
  // networkOptions[2] - Avalanche Testnet
  const [sourceNetwork, setSourceNetwork] = useState<Item>(networkOptions[1]);

  const [targetToken, setTargetToken] = useState<Item>(tokenOptionsAvalanche[0]);
  // It is equal to the destinationChainId?
  const [targetNetwork, setTargetNetwork] = useState<Item>(networkOptions[2]);
  // alert(targetNetwork.name);

  const [allowanceEnough, setAllowanceEnough] = useState(false);

  // This is decided by metamask or that means a blockchain network selected by a user 
  const { chain } = useNetwork();
  const chainId = chain ? chain.id : SUPPORT_CHAIN_IDS.AVALANCHE;
  
  const contractForAllowance = `${String(chain && (sourceToken.id === 1 ? ATOKEN_ADDRESS[chainId] : BTOKEN_ADDRESS[chainId]))}`;
  const contractForApprove = `${String(chain && (sourceToken.id === 1 ? ATOKEN_ADDRESS[chainId] : BTOKEN_ADDRESS[chainId]))}`;
  const contractForSwapRemote = `${ORACLE_SWAP_ADDRESS[chainId]}`;

  const isUserAtPolygonChain = (chainId === SUPPORT_CHAIN_IDS.MUMBAI);
  const isUserAtBinanceChain = (chainId === SUPPORT_CHAIN_IDS.BINANCE);
  const isUserAtAvalancheChain = (chainId === SUPPORT_CHAIN_IDS.AVALANCHE);

  let sourceChainId: string;
  let destinationChainId: string;
  let sourceChainTokenSymbol: string;
  let sourceTokenOptions = tokenOptionsAvalanche; // Use default value to solve type issue quickly

  if (isUserAtPolygonChain) {
    sourceChainId = EvmChain.POLYGON;
    sourceChainTokenSymbol = GasToken.MATIC;
    sourceTokenOptions = tokenOptionsPolygon;
  }

  if (isUserAtBinanceChain) {
    sourceChainId = EvmChain.BINANCE;
    sourceChainTokenSymbol = GasToken.BINANCE;
    sourceTokenOptions = tokenOptionsBinance;

    // Our starting point
    // sourceChainId = chainId === SUPPORT_CHAIN_IDS.BINANCE ? EvmChain.BINANCE : EvmChain.AVALANCHE;
    // destinationChainId = chainId === SUPPORT_CHAIN_IDS.BINANCE ? EvmChain.AVALANCHE : EvmChain.BINANCE;
    // sourcChainTokenSymbol = chainId === SUPPORT_CHAIN_IDS.BINANCE ? GasToken.BINANCE : GasToken.AVAX;
  }

  if (isUserAtAvalancheChain) {
    sourceChainId = EvmChain.AVALANCHE;
    sourceChainTokenSymbol = GasToken.AVAX;
    sourceTokenOptions = tokenOptionsAvalanche;
  }

  const isTargetNetworkPolygonChain = (targetNetwork.value === SUPPORT_CHAIN_IDS.MUMBAI);
  const isTargetNetworkBinanceChain = (targetNetwork.value === SUPPORT_CHAIN_IDS.BINANCE);
  const isTargetNetworkAvalancheChain = (targetNetwork.value === SUPPORT_CHAIN_IDS.AVALANCHE);

  // Default value again to solve type issue quickly for it is still testing purpose
  let targetTokenOptions = tokenOptionsPolygon;
  if (isTargetNetworkPolygonChain) {
    destinationChainId = EvmChain.POLYGON;
    targetTokenOptions = tokenOptionsPolygon;
  }
  
  if (isTargetNetworkBinanceChain) {
    destinationChainId = EvmChain.BINANCE
    targetTokenOptions = tokenOptionsBinance;
  }
  
  if (isTargetNetworkAvalancheChain) {
    destinationChainId = EvmChain.AVALANCHE;
    targetTokenOptions = tokenOptionsAvalanche;
  }

  const isSourceNetworkPolygon = (sourceNetwork.value === SUPPORT_CHAIN_IDS.MUMBAI);
  const isSourceNetworkBinance = (sourceNetwork.value === SUPPORT_CHAIN_IDS.BINANCE);
  const isSourceNetworkAvalanche = (sourceNetwork.value === SUPPORT_CHAIN_IDS.AVALANCHE);

  // Extaract till this somehwere else later and modulize this page as well.

  const { address } = useAccount();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { data: walletClient } = useWalletClient();
  
  const { data: allowanceData, refetch } = useContractRead({
    address: `0x${contractForAllowance.substring(2)}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address, ORACLE_SWAP_ADDRESS[chainId]]
  });

  const {
    writeAsync: swapRemoteCall,
    data: swapData,
    isSuccess: swapSuccess
  } = useContractWrite({
    address: `0x${contractForSwapRemote.substring(2)}`,
    abi: ORACLE_SWAP_ABI,
    functionName: "swapRemote"
  });

  const {
    data: approveData,
    writeAsync: approveCall
  } = useContractWrite({
    address: `0x${contractForApprove.substring(2)}`,
    abi: ERC20_ABI,
    functionName: "approve"
  });

  const { isSuccess: approveSuccess } = useWaitForTransaction({
    hash: approveData?.hash
  });

  const onApprove = async () => {
    if (!chain || !walletClient || !address) return;

    try {
      const spendAmount = ethers.utils.parseEther(amount.toString());

      if (!BigNumber.from(String(allowanceData || 0)).gte(spendAmount)) {
        await approveCall({
          args: [ORACLE_SWAP_ADDRESS[chainId], ethers.utils.parseEther(amount.toString())]
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSwap = async () => {
    if (!chain || !walletClient || !address) return;

    try {
      const spendAmount = ethers.utils.parseEther(amount.toString());
      setSwapping(true);
      const estimateGasUsed = 400000;

      const sdk = new AxelarQueryAPI({
        environment: Environment.TESTNET
      });

      
      const gasFee = await sdk.estimateGasFee(
        sourceChainId,
        destinationChainId,
        sourceChainTokenSymbol,
        
        estimateGasUsed
      );

      await swapRemoteCall({
        args: [
          // targetNetwork.value === SUPPORT_CHAIN_IDS.AVALANCHE ? "Avalanche" : "Binance",
          targetNetwork.name,

          ORACLE_SWAP_ADDRESS[Number(targetNetwork.value)],
          sourceToken.id === 1 ? ATOKEN_ADDRESS[chainId] : BTOKEN_ADDRESS[chainId],
          targetToken.id === 1 ? ATOKEN_ADDRESS[chainId] : BTOKEN_ADDRESS[chainId],
          
          spendAmount
        ],
        value: createBigInt(Number(gasFee))
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSwapping(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (switchNetworkAsync) {
        try {
          await switchNetworkAsync(Number(sourceNetwork.value));

          // Give default value to solve type issue quickly
          let sourceToken = tokenOptionsPolygon[0];
          // let targetNetwork;
          if (isSourceNetworkPolygon) {
            sourceToken = tokenOptionsPolygon[0];
          }

          if (isSourceNetworkBinance) {
            sourceToken = tokenOptionsBinance[0];
          }

          if (isSourceNetworkAvalanche) {
            sourceToken = tokenOptionsAvalanche[0];
          }

          setSourceToken(sourceToken);
          // Let users decide the target network themselves because it is no more binary options?
          // We can also use randomly decide the rest of the blokchain options etc
          // setTargetNetwork(sourceNetwork.value === SUPPORT_CHAIN_IDS.AVALANCHE ? networkOptions[1] : networkOptions[2]);
        } catch (e) {
          // Binance by default
          setSourceNetwork(networkOptions[1]);
          console.error(e);
        }
      }
    })();
  }, [sourceNetwork, switchNetworkAsync]);

  useEffect(() => {
    let targetToken = tokenOptionsAvalanche[0];
    if (isTargetNetworkPolygonChain) {
      targetToken = tokenOptionsAvalanche[0];
    }

    if (isTargetNetworkBinanceChain) {
      targetToken = tokenOptionsBinance[0];
    }

    if (isTargetNetworkAvalancheChain) {
      targetToken = tokenOptionsAvalanche[0];
    }

    setTargetToken(targetToken);
  }, [targetNetwork]);

  useEffect(() => {
    setAllowanceEnough(allowanceData ? BigNumber.from(String(allowanceData)).gte(ethers.utils.parseEther(amount.toString())) : false);
  }, [amount, allowanceData]);

  useEffect(() => {
    refetch().then((e) => console.log(e));
  }, [approveSuccess]);

  return (
    <div className={"w-[420px] px-4 py-2 bg-gray-200 text-black rounded-lg mx-auto"}>
      <div className={"font-medium"}>Swap</div>

      <div className={"mt-5 text-xs"}>From</div>
      <div className={"flex items-center justify-between space-x-3"}>
        <div className={"basis-2/3 w-full"}>
          <Dropdown
            options={sourceTokenOptions}
            defaultOption={sourceToken}
            selected={sourceToken}
            onChange={(option) => setSourceToken(option)}
          />
        </div>
        <div className={"basis-1/3 w-full"}>
          <Dropdown
            options={networkOptions}
            defaultOption={networkOptions[2]}
            selected={sourceNetwork}
            onChange={(option) => setSourceNetwork(option)}
          />
        </div>
      </div>

      <div className={"mt-5 text-xs"}>To</div>
      <div className={"flex items-center justify-between space-x-3"}>
        <div className={"basis-2/3 w-full"}>
          <Dropdown
            options={targetTokenOptions}
            defaultOption={targetToken}
            selected={targetToken}
            onChange={(option) => setTargetToken(option)}
          />
        </div>
        <div className={"basis-1/3 w-full"}>
          <Dropdown
            options={networkOptions}
            defaultOption={networkOptions[0]}
            selected={targetNetwork}
            onChange={(option) => setTargetNetwork(option)}
          />
        </div>
      </div>

      <div className={"mt-5 text-xs"}>Total Amount</div>
      <input
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className={"bg-white h-8 rounded-lg shadow-md mt-1 w-full px-2 text-sm focus:outline-none"}
      />

      {!allowanceEnough && (
        <div className={"mt-12"}>
          <button className={"bg-[#232323] text-white h-10 rounded-lg shadow-md w-full px-2 text-sm"} onClick={onApprove}>
            {swapping ? "Approve In progress" : "Approve"}
          </button>
        </div>
      )}

      {allowanceEnough && (
        <div className={"mt-12"}>
          <button
            className={"bg-[#232323] text-white h-10 rounded-lg shadow-md w-full px-2 text-sm"}
            onClick={onSwap}
            disabled={swapping || amount === 0}
          >
            {swapping ? "Swap In progress" : "Swap"}
          </button>
        </div>
      )}

      {swapSuccess && (
        <div className={"mt-2 flex items-center justify-center"}>
          <a href={`https://testnet.axelarscan.io/gmp/${swapData?.hash}`} target={"_blank"} rel='noreferrer'>
            Link to Axelar Explorer
          </a>
        </div>
      )}
    </div>
  );
};

export default SwapSection;
