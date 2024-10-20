import { useEffect, useState } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import voterPersonImg from "/vote_Person.jpg";
import Layout from "../Layout";
import { motion } from "framer-motion";

const Wallet = () => {
  const { handleWallet, web3State } = useWeb3Context();
  const { selectedAccount } = web3State;
  const [loading, setLoading] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const navigateTo = useNavigate();

  useEffect(() => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      setIsMetaMaskInstalled(true);
    } else {
      setIsMetaMaskInstalled(false);
    }
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      setLoading(false);
      toast.success(`Wallet connected: ${selectedAccount.slice(0, 6)}...`);
      navigateTo("/select");
    }
  }, [selectedAccount, navigateTo]);

  const handleConnectWallet = async () => {
    setLoading(true); 
    await handleWallet();
  };

  return (
    <Layout>
      <div className="relative flex flex-col justify-center items-center h-screen px-4 md:px-8 lg:px-16">
        <ToastContainer />
        {isMetaMaskInstalled ? (
          <div className="relative z-10 flex flex-col items-center text-center animate-fadeIn">
            <img
              className="w-32 h-32 md:w-48 md:h-48 mb-6 drop-shadow-2xl rounded-full shadow-2xl transform transition-transform duration-300 hover:scale-110 animate-zoomIn"
              src={voterPersonImg}
              alt="Voter"
            />
            <h1 className="text-white bg-black text-4xl p-4 rounded-lg md:text-7xl font-bold mb-8 drop-shadow-lg">
              Welcome to D-Voting
              <motion.p
                className="text-white text-base p-2 rounded-lg md:text-lg font-bold mb-4 drop-shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
              >
                "Decentralized Voting: The Future of Elections"
              </motion.p>
            </h1>

            <button
              onClick={handleConnectWallet}
              className="px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-full shadow-lg transform hover:scale-110 transition duration-300 ease-in-out hover:bg-indigo-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 animate-bounce"
            >
              {loading
                ? "Connecting..." 
                : selectedAccount
                ? `Connected: ${selectedAccount.slice(0, 6)}...`
                : "Connect Wallet"}
            </button>
          </div>
        ) : (
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">MetaMask is not installed</h2>
            <p className="text-lg mb-6">
              To use this application, you need to install MetaMask.
            </p>
            <a
              href="https://metamask.io/download.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-full shadow-lg transform hover:scale-110 transition duration-300 ease-in-out"
            >
              Install MetaMask
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wallet;
