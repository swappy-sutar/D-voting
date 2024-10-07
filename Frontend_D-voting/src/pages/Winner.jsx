import React, { useState } from "react";
import { useWeb3Context } from "../context/UseWeb3Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti";

function Winner() {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [loading, setLoading] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleWinner = async () => {
    setLoading(true);
    try {
      const winnerAddress = await contractInstance.winner();
      console.log("Winner Address:", winnerAddress);

      const candidate = await contractInstance.getCandidate(winnerAddress);
      setWinnerInfo({
        address: winnerAddress,
        name: candidate[0],
        party: candidate[1],
      });
      setShowConfetti(true);
    } catch (err) {
      console.error("Error fetching winner:", err);
      toast.error("Winner is not declared.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 ">
      <ToastContainer />
      {showConfetti && <Confetti />}

      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg border border-gray-300 relative">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-6 text-center animate-bounce">
          Winner Details
        </h1>

        {!winnerInfo && ( 
          <button
            onClick={handleWinner}
            disabled={loading}
            className={`px-6 py-3 w-full md:w-auto text-xl font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out transform ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-400 to-blue-500 hover:scale-105 hover:from-green-500 hover:to-blue-600"
            } text-white mb-4 mx-auto shadow-xl`}
          >
            {loading ? "Loading..." : "Get Winner"}
          </button>
        )}

        {winnerInfo && (
          <div className="bg-white p-6 rounded-xl shadow-2xl border-black w-full max-w-lg mx-auto transform transition-all duration-300 ease-in-out">
            <div className="text-center mb-4 animate-fade-in">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                🎉 Congratulations! 🎉
              </h2>
              <p className="text-lg font-medium text-gray-700 mb-2">
                The winner has been announced!
              </p>
            </div>
            <div className="border-t border-gray-200 pt-4 text-center">
              <p className="text-xl mb-2">
                <strong>Name:</strong> {winnerInfo.name}
              </p>
              <p className="text-xl mb-2">
                <strong>Party:</strong> {winnerInfo.party}
              </p>
              <p className="text-xl mb-2">
                <strong>Address:</strong> {winnerInfo.address}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Winner;
