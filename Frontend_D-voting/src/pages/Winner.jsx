import React, { useState } from "react";
import { useWeb3Context } from "../context/UseWeb3Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti";
import Layout from "../Components/Layout";

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

      if (winnerAddress === "0x0000000000000000000000000000000000000000") {
        toast.error("Winner is not declared yet!");
      } else {
        const candidate = await contractInstance.getCandidate(winnerAddress);
        setWinnerInfo({
          address: winnerAddress,
          name: candidate[0],
          party: candidate[1],
        });
        setShowConfetti(true);
      }
    } catch (err) {
      console.error("Error fetching winner:", err);
      toast.error("Winner is not declared.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <ToastContainer />

        <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg border border-gray-300 relative">
          {showConfetti && (
            <Confetti className="justify-center h-full w-full" />
          )}
          <h1 className="text-5xl font-extrabold text-blue-900 mb-6 text-center animate-bounce">
            Winner Details
          </h1>

          {!winnerInfo && (
            <div className="flex justify-center">
              <button
                onClick={handleWinner}
                disabled={loading}
                className={`px-8 py-4 w-full md:w-auto text-xl font-bold rounded-lg shadow-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-blue-600"
                } text-white mb-6 mx-auto`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <span className="loader"></span>
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Reveal Winner"
                )}
              </button>
            </div>
          )}

          {winnerInfo && (
            <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-300 w-full max-w-lg mx-auto transform transition-all duration-300 ease-in-out">
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
    </Layout>
  );
}

export default Winner;
