import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import MintSection from "../components /MintSection";
import NoSsr from "../components /NoSsr";
import SwapSection from "../components /SwapSection";

const Home: NextPage = () => {
  return (
    <NoSsr>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 12
        }}
      >
        <ConnectButton />
      </div>

      <div className={"mt-6 relative"}>
        <SwapSection />
      </div>

      <div className={"mt-12"}>
        <MintSection />
      </div>
    </NoSsr>
  );
};

export default Home;
