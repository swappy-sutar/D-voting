import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";

function VotingStatus() {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [votingStatus, setVotingStatus] = useState("");

  const statusMap = {
    0: "Not Started",
    1: "In Progress",
    2: "Ended",
    3: "Voting Stopped",
  };

  useEffect(() => {
    const getVotingStatus = async () => {
      try {
        const currentStatus = await contractInstance.getVotingStatus();
        setVotingStatus(statusMap[currentStatus]);
      } catch (error) {
        console.error(error);
      }
    };
    contractInstance && getVotingStatus();
  }, [contractInstance]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-gray-800">
          Voting Status: {votingStatus || "Loading..."}
        </h1>
      </div>
    </div>
  );
}

export default VotingStatus;
