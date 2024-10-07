import React, { useState } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";

function ContractBalance() {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [balance, setBalance] = useState("");

  const handleElectionCommissionBalance = async () => {
    try {
      const balanceInWei = await contractInstance.electionCommissionBalance();
      const balanceInEth = ethers.formatEther(balanceInWei); 
      setBalance(balanceInEth);

      toast.success("Balance fetched successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch balance!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-md p-10">
      <ToastContainer />

      <button
        onClick={handleElectionCommissionBalance}
        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition duration-300 mb-4"
      >
        Fetch Balance
      </button>

      <h2 className="text-lg font-bold text-gray-800">
        Contract Balance: <br /> <span className="text-green-600 ">"{balance}" ETH/MATIC</span>
      </h2>
    </div>
  );
}

export default ContractBalance;
