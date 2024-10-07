import React, { useState } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetElection() {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [loading, setLoading] = useState(false);

  const handleResetElection = async () => {
    try {
      if (contractInstance) {
        setLoading(true);
        const reset = await contractInstance.resetElection();
        console.log("reset", reset);
        toast.success("Election reset successfully!");
      } else {
        toast.error("Contract instance is not available.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Access denied!" );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg shadow-md bg-gray-100 p-12">
      <ToastContainer />
      <button
        onClick={handleResetElection}
        disabled={loading}
        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
      >
        {loading ? "Resetting..." : "Reset Election"}
      </button>
    </div>
  );
}

export default ResetElection;
