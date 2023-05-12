import { useState } from "react";
import { useAccount, useContractWrite, useNetwork } from "wagmi";
import ERC20_ABI from "../utils/abis/ERC20.json";
import { ATOKEN_ADDRESS, BTOKEN_ADDRESS } from "../utils/constant";
import { SUPPORT_CHAIN_IDS } from "../utils/enums";
import { ethers } from "ethers";

const MintSection = () => {
  const [amount, setAmount] = useState(0);

  const { chain } = useNetwork();
  const chainId = chain ? chain.id : SUPPORT_CHAIN_IDS.AVALANCHE;
  
  const { address } = useAccount();
  
  const { writeAsync: mintA } = useContractWrite({
    address: `0x${ATOKEN_ADDRESS[chainId].substring(2)}`,
    abi: ERC20_ABI,
    functionName: "mint"
  });
  const { writeAsync: mintB } = useContractWrite({
    address: `0x${BTOKEN_ADDRESS[chainId].substring(2)}`,
    abi: ERC20_ABI,
    functionName: "mint"
  });

  const onMintAToken = async () => {
    if (!chain || !address) return;
    if (amount <= 0) return;

    await mintA({
      args: [address, ethers.utils.parseEther(amount.toString())]
    });
  };

  const onMintBToken = async () => {
    if (!chain || !address) return;
    if (amount <= 0) return;

    await mintB({
      args: [address, ethers.utils.parseEther(amount.toString())]
    });
  };

  return (
    <div className={"w-[420px] px-4 py-2 bg-gray-200 text-black rounded-lg mx-auto"}>
      <div className={"font-medium"}>Mint</div>

      <input
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className={"bg-white h-8 rounded-lg shadow-md mt-1 w-full px-2 text-sm focus:outline-none"}
      />

      <div className={"flex items-center justify-between space-x-3 mt-3"}>
        <div className={"flex-1 w-full"}>
          <button className={"bg-[#232323] text-white h-10 rounded-lg shadow-md w-full px-2 text-sm"} onClick={onMintAToken}>
            Mint TokenA
          </button>
        </div>
        <div className={"flex-1 w-full"}>
          <button className={"bg-[#232323] text-white h-10 rounded-lg shadow-md w-full px-2 text-sm"} onClick={onMintBToken}>
            Mint TokenB
          </button>
        </div>
      </div>
    </div>
  );
};

export default MintSection;
