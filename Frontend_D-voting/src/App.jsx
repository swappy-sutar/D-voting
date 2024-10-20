import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import Layout from "../src/Components/Layout"
 
export const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [hasMetaMask, setHasMetaMask] = useState(true);

  useEffect(() => {
    if (typeof window.ethereum === "undefined") {
      setHasMetaMask(false);
      toast.error("MetaMask is not detected! Please install MetaMask.");
    }
  }, []);

  if (!hasMetaMask) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">MetaMask not detected!</h1>
          <p className="mb-4">
            Please install MetaMask to use this application.
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() =>
              window.open("https://metamask.io/download.html", "_blank")
            }
          >
            Install MetaMask
          </button>
        </div>
      </Layout>
    );
  }

  return <Web3Context.Provider value={{}}>{children}</Web3Context.Provider>;
};

export default Web3Provider;
