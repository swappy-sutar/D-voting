import React, { useState, useEffect } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Emergency() {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [votingStatus, setVotingStatus] = useState("");

  const votingStatusMap = {
    0: "Not Started",
    1: "In Progress",
    2: "Ended",
    3: "Voting Stopped",
  };

  const fetchVotingStatus = async () => {
    try {
      if (!contractInstance) {
        toast.error("Please reload and try again");
      } else {
        const status = await contractInstance.getVotingStatus();
        const statusString =
          votingStatusMap[status.toString()] || "Unknown Status";
        setVotingStatus(statusString);
      }
    } catch (error) {
      console.error("Error fetching voting status:", error);
      setError("Failed to fetch voting status.");
      toast.error("Failed to fetch voting status.");
    }
  };

  useEffect(() => {
    fetchVotingStatus();
  }, [contractInstance]);

  const handleEmergencyStopVoting = async (e) => {
    e.preventDefault();
    setError(null);

    if (votingStatus !== "In Progress") {
      toast.error(
        "Emergency stop can only be called when voting is in progress."
      );
      return;
    }

    const confirmation = window.confirm("Do you really want to stop voting?");
    if (!confirmation) return;

    setLoading(true);
    try {
      const transaction = await contractInstance.emergencyStopVoting();
      await transaction.wait();

      // Fetch updated status after stopping the voting
      fetchVotingStatus();

      toast.success("Voting has been stopped successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to stop voting. Please try again.");
      toast.error("Failed to stop voting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg shadow-md bg-gray-100 p-14">
      <ToastContainer />
      {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

      <button
        onClick={handleEmergencyStopVoting}
        disabled={loading}
        className={`px-6 py-3 ${
          loading ? "bg-gray-500" : "bg-red-600"
        } text-white font-semibold rounded-md shadow-md hover:${
          loading ? "bg-gray-600" : "bg-red-700"
        } transition duration-300`}
      >
        {loading ? "Stopping Voting..." : "Emergency Stop Voting"}
      </button>
    </div>
  );
}

export default Emergency;
