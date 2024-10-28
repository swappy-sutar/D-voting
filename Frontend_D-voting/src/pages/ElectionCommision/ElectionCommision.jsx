import React, { useState, useEffect } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "../../Components/Layout";
import AnnounceResult from "../../Components/ElectionCommision/AnnounceResult";
import Emergency from "../../Components/ElectionCommision/Emergency";
import VotingTimePeriod from "../../Components/ElectionCommision/VotingTimePeriod";
import ResetElection from "../../Components/ElectionCommision/ResetElection";
import ContractBalance from "../../Components/ElectionCommision/GetContractBalance";
import TransferETH from "../../Components/ElectionCommision/TransferETH";
import TransferOwnerShip from "../../Components/ElectionCommision/TransferOwnerShip";

function ElectionCommision() {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [votingStatus, setVotingStatus] = useState(null);
  const [address, setAddress] = useState(null);

  const navigateTo = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigateTo("/");
    }
  }, [navigateTo, token]);

  const votingStatusMap = {
    0: "Not Started",
    1: "In Progress",
    2: "Ended",
    3: "Voting Stopped",
  };

  const fetchVotingStatus = async () => {
    try {
      const status = await contractInstance.getVotingStatus();
      const statusString =
        votingStatusMap[status.toString()] || "Unknown Status";
      setVotingStatus(statusString);
    } catch (error) {
      console.error("Error fetching voting status:", error);
    }
  };

  useEffect(() => {
    const fetchElectionCommissionData = async () => {
      try {
        const electionCommission = await contractInstance.electionCommission();
        setAddress(electionCommission);
        fetchVotingStatus();
      } catch (error) {
        console.error("Error fetching election commission data:", error);
      }
    };

    if (contractInstance) {
      fetchElectionCommissionData();
    }
  }, [contractInstance]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center my-6 p-4 sm:p-6 md:p-8">
        <ToastContainer />
        <div className="w-full max-w-5xl bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-md border border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 text-center">
            Election Commission Dashboard
          </h1>
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 text-center">
            Election Commission Address:{" "}
            <span className="font-thin text-gray-900">{address}</span>
          </h2>

          <h2 className="text-lg sm:text-xl font-extrabold text-gray-500 mb-3 text-center">
            Status: Voting is "{votingStatus}"
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="flex flex-col">
              <VotingTimePeriod />
              <div className="mt-4">
                <TransferOwnerShip />
              </div>
              <div className="mt-4">
                <TransferETH />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Emergency />
              <AnnounceResult />
              <ResetElection />
              <ContractBalance />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ElectionCommision;
