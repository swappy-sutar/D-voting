import React, { useEffect, useState } from "react";
import { Web3Context } from "../context/Web3Context";
import { GetWeb3State } from "../utils/GetWeb3State";
import { handleAccountChange } from "../utils/HandleAccountChange";
import { handleChainChange } from "../utils/HandleChainChange";
import { toast } from "react-toastify";
import Layout from "../Components/Layout";
import { motion } from "framer-motion";

const Web3Provider = ({ children }) => {
  const [web3State, setWeb3State] = useState({
    contractInstance: null,
    selectedAccount: null,
    chainId: null,
  });

  const [hasMetaMask, setHasMetaMask] = useState(true);

  const handleWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const { contractInstance, selectedAccount, chainId } =
          await GetWeb3State();
        setWeb3State({ contractInstance, selectedAccount, chainId });
      } else {
        setHasMetaMask(false);
        toast.error(
          "MetaMask is not detected! Please install MetaMask to use this application."
        );
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast.error("Failed to connect to wallet.");
    }
  };

  useEffect(() => {
    if (typeof window.ethereum === "undefined") {
      setHasMetaMask(false);
      toast.error(
        "MetaMask is not detected! Please install MetaMask to use this application."
      );
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
          <div className="relative z-10 flex flex-col items-center text-center animate-fadeIn">
            <motion.h1
              className="text-white bg-black text-xl md:text-6xl p-6 rounded-lg font-bold mb-5 drop-shadow-lg"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              MetaMask Not Detected
              <motion.p
                className="text-white text-lg md:text-xl m-5"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }}
              >
                "Please install MetaMask to use this application"
              </motion.p>
            </motion.h1>

            <motion.button
              onClick={() =>
                window.open("https://metamask.io/download.html", "_blank")
              }
              className="px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-full shadow-lg transform hover:scale-110 transition duration-300 ease-in-out hover:bg-indigo-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Install MetaMask
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
