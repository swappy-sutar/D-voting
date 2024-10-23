import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3Context } from "../../context/UseWeb3Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function ResetElection() {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !contractInstance) {
      navigateTo("/");
    }
  }, [navigateTo, contractInstance, token]);

  const handleResetElection = async () => {
    try {
      setLoading(true);
      const transaction = await contractInstance.resetElection();
      const receipt = await transaction.wait();

      if (receipt.status === 1) {
        await Promise.all([
          deleteAllDataOfVoters(),
          deleteAllDataOfCandidates(),
        ]);
        toast.success("Election reset successfully!");
      } else {
        toast.error("Transaction failed");
      }
    } catch (error) {
      console.error(error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAllDataOfVoters = async () => {
    try {
      const response = await fetch(
        `https://d-voting-backend.vercel.app/api/v1/voter/delete-All-Voters`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await response.json();
      if (response.ok) {
        console.log("Voters deleted successfully", res);
      } else {
        console.error("Failed to delete voters", res);
        toast.error("Failed to delete voters.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while deleting voters.");
    }
  };

  const deleteAllDataOfCandidates = async () => {
    try {
      const response = await fetch(
        `https://d-voting-backend.vercel.app/api/v1/candidate/delete-All-Candidates`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await response.json();
      if (response.ok) {
        console.log("Candidates deleted successfully", res);
      } else {
        console.error("Failed to delete candidates", res);
        toast.error("Failed to delete candidates.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while deleting candidates.");
    }
  };

  const handleError = async (error) => {
    console.error(error);
    try {
      const currentVotingStatus = await contractInstance.getVotingStatus();
      const votingStatusMap = {
        0: "Not Started",
        1: "In Progress",
        2: "Ended",
        3: "Voting Stopped",
      };
      const statusString =
        votingStatusMap[currentVotingStatus.toString()] || "Unknown Status";
      toast.error(`Status: Voting is ${statusString}`);
    } catch (statusError) {
      console.error(statusError);
      toast.error("Could not retrieve voting status.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg shadow-md bg-gray-100 p-14">
      <ToastContainer />
      <button
        onClick={handleResetElection}
        disabled={loading}
        className={`px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition duration-300 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Resetting..." : "Reset Election"}
      </button>
    </div>
  );
}

export default ResetElection;
