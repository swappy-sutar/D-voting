import React, { useState } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom"; 
import "react-toastify/dist/ReactToastify.css";

function AnnounceResult() {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate(); 

  const handleAnnounceResult = async () => {
    setLoading(true);
    try {
      const transaction = await contractInstance.announceResult();

      const receipt = await transaction.wait();
      if (receipt.status === 1) {
        toast.success("Result announced successfully");
      } else {
        toast.error("Failed to announce result");
      }
    } catch (err) {
      console.error(err);
      toast.error("Voting is not started or not over.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg shadow-md bg-gray-100 p-6">
      <ToastContainer />

      <button
        onClick={handleAnnounceResult}
        disabled={loading}
        className={`px-6 py-3 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        } text-white font-semibold rounded-lg shadow-lg transition duration-300`}
      >
        {loading ? "Announcing..." : "Announce Result"}
      </button>

      <p
        onClick={() => navigateTo("/get-winner")}
        className="text-blue-500 hover:underline cursor-pointer mt-4"
      >
        Click here to get the winner
      </p>
    </div>
  );
}

export default AnnounceResult;
