import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";
import Layout from "../../Components/Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const apiurl = import.meta.env.VITE_WEB_URL;

function Vote() {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [candidateList, setCandidateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [votingStatus, setVotingStatus] = useState("");
  const [candidateImages, setCandidateImages] = useState([]);
  const [votingLoading, setVotingLoading] = useState({});

  const navigateTo = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !contractInstance) {
      navigateTo("/");
    }
  }, [navigateTo, contractInstance, token]);

  const votingStatusMap = {
    0: "Not Started",
    1: "In Progress",
    2: "Ended",
    3: "Voting Stopped",
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        if (!contractInstance) return;

        const candidateAddresses = await contractInstance.getCandidateList();
        if (candidateAddresses.length === 0) {
          toast.error("No candidates available");
          return;
        }

        const candidateDetails = await Promise.all(
          candidateAddresses.map(async (address) => {
            const candidate = await contractInstance.getCandidate(address);
            return {
              address,
              name: candidate[0],
              party: candidate[1],
              age: Number(candidate[2]),
              gender: Number(candidate[3]),
            };
          })
        );
        setCandidateList(candidateDetails);
        toast.success("Candidate list fetched successfully!");
      } catch (error) {
        setError("Failed to fetch candidate list.");
        toast.error("Failed to fetch candidate list.");
      }
      setLoading(false);
    };

    const fetchImages = async () => {
      try {
        const response = await fetch(
          `${apiurl}/api/v1/candidate/get-candidate-list`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const res = await response.json();
        if (res.status) {
          const images = res.data.map((candidate) => ({
            imageUrl: `${apiurl}/D-voting/candidateImages/${candidate.imageName}`,
            accountAddress: candidate.accountAddress,
          }));
          setCandidateImages(images);
        } else {
          setError(res.message);
        }
      } catch (error) {
        setError("Failed to fetch candidate images.");
      }
    };

    const fetchVotingStatus = async () => {
      try {
        const status = await contractInstance.getVotingStatus();
        const statusString =
          votingStatusMap[status.toString()] || "Unknown Status";
        setVotingStatus(statusString);
      } catch (error) {
        toast.error("Failed to fetch voting status.");
      }
    };

    if (contractInstance) {
      fetchCandidates();
      fetchVotingStatus();
      fetchImages();
    }
  }, [contractInstance, token]);

  const getCandidateImage = (candidateAddress) => {
    const candidateImage = candidateImages.find(
      (image) =>
        image.accountAddress.toLowerCase() === candidateAddress.toLowerCase()
    );
    return candidateImage ? (
      <img
        height="70px"
        width="70px"
        src={candidateImage.imageUrl}
        alt="Candidate"
        className="rounded-full"
      />
    ) : (
      <span>No Image</span>
    );
  };

  const vote = async (candidate) => {
    try {
      setVotingLoading((prev) => ({ ...prev, [candidate.address]: true }));
      const candidateAddress = candidate.address;
      const transaction = await contractInstance.vote(candidateAddress);
      const receipt = await transaction.wait();

      if (receipt.status === 1) {
        toast.success("Vote Submitted successfully!");
      } else {
        toast.error("Transaction failed.");
      }
    } catch (error) {
      const currentVotingStatus = await contractInstance.getVotingStatus();
      const statusString =
        votingStatusMap[currentVotingStatus.toString()] || "Unknown Status";
      toast.error(`Status: Voting is ${statusString}`);
    } finally {
      setVotingLoading((prev) => ({ ...prev, [candidate.address]: false }));
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-5 text-center">
            Vote for Your Candidate
          </h2>
          <h3 className="text-lg font-extrabold text-gray-500 mb-4 text-center">
            Status: Voting is "{votingStatus}"
          </h3>

          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-10 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Party
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Vote
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {candidateList.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-600"
                      >
                        No candidates found.
                      </td>
                    </tr>
                  ) : (
                    candidateList.map((candidate, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-100 transition-colors duration-300"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {candidate.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-500">
                          {candidate.party}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getCandidateImage(candidate.address)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            type="button"
                            disabled={votingLoading[candidate.address]}
                            className={`w-32 py-3 ${
                              votingLoading[candidate.address]
                                ? "bg-gray-400"
                                : "bg-blue-600"
                            } text-white font-semibold rounded-md transition duration-300 flex items-center justify-center`}
                            onClick={() => vote(candidate)}
                          >
                            {votingLoading[candidate.address] ? (
                              <>
                                <svg
                                  className="animate-spin h-5 w-5 mr-2"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                  />
                                </svg>
                                Voting...
                              </>
                            ) : (
                              "Vote"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Vote;
