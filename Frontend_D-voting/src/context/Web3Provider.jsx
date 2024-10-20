import React, { useEffect, useState } from "react";
import { Web3Context } from "../context/Web3Context";
import { GetWeb3State } from "../utils/GetWeb3State";
import { handleAccountChange } from "../utils/HandleAccountChange";
import { handleChainChange } from "../utils/HandleChainChange";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Layout from "../Components/Layout";

const Web3Provider = ({ children }) => {
  const [web3State, setWeb3State] = useState({
    contractInstance: null,
    selectedAccount: null,
    chainId: null,
  });

  const [hasMetaMask, setHasMetaMask] = useState(true);

  const handleWallet = async () => {
    try {
      const { contractInstance, selectedAccount, chainId } =
        await GetWeb3State();
      setWeb3State({ contractInstance, selectedAccount, chainId });
    } catch (error) {
      console.error(
        "contractInstance, selectedAccount, chainId is not found",
        error
      );
    }
  };

  useEffect(() => {
    if (typeof window.ethereum === "undefined") {
      setHasMetaMask(false);
      toast.error("Please install MetaMask");
    } else {
      window.ethereum.on("accountsChanged", () =>
        handleAccountChange(setWeb3State)
      );
      window.ethereum.on("chainChanged", () => handleChainChange(setWeb3State));

      return () => {
        window.ethereum.removeListener("accountsChanged", () =>
          handleAccountChange(setWeb3State)
        );
        window.ethereum.removeListener("chainChanged", () =>
          handleChainChange(setWeb3State)
        );
      };
    }
  }, []);

 
  if (!hasMetaMask) {
    return (
      <Layout>
        <div className="relative flex flex-col items-center justify-center h-screen px-4 md:px-8 lg:px-16">
          <div className="relative z-10 flex flex-col items-center text-center ">
            <h1 className="text-white bg-black text-4xl p-4 rounded-lg md:text-7xl font-bold mb-8 drop-shadow-lg">
              MetaMask Not Detected
              <motion.p
                className="text-white text-base p-2 rounded-lg md:text-lg font-bold mb-4 drop-shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
              >
                "Please install MetaMask Wallet to use this application"
              </motion.p>
            </h1>

            <motion.button
              onClick={() =>
                window.open("https://metamask.io/download.html", "_blank")
              }
              className="px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-full shadow-lg transform hover:scale-110 transition duration-300 ease-in-out hover:bg-indigo-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 animate-bounce"
            >
              Install MetaMask🦊
            </motion.button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Web3Context.Provider value={{ web3State, handleWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
