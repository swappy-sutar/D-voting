import React, { useEffect, useState } from "react";
import { Web3Context } from "../context/Web3Context";
import { GetWeb3State } from "../utils/GetWeb3State";
import { handleAccountChange } from "../utils/HandleAccountChange";
import { handleChainChange } from "../utils/HandleChainChange";

const Web3Provider = ({ children }) => {
  const [web3State, setWeb3State] = useState({
    contractInstance: null,
    selectedAccount: null,
    chainId: null,
  });

 const handleWallet = async () => {
   try {
     const { contractInstance, selectedAccount, chainId } = await GetWeb3State();
     setWeb3State({ contractInstance, selectedAccount, chainId });
   } catch (error) {
     console.error("contractInstance, selectedAccount, chainId is not found ",error);
   }
 };

  useEffect(() => {
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
  }, []);



  return (
    <Web3Context.Provider value={{ web3State, handleWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
