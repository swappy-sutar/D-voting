import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";
import Layout from "../../Components/Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Vote() {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [candidateList, setCandidateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [votingStatus, setVotingStatus] = useState("");
  const [candidateImages, setCandidateImages] = useState([]);
  const [votingLoading, setVotingLoading] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigateTo = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !contractInstance) {
      navigateTo("/");
    }
  }, [contractInstance, token, navigateTo]);

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
        fetchVotingTime();

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
        toast.success("Candidates fetched successfully!");
      } catch (error) {
        setError("Failed to fetch candidate list.");
        toast.error("Failed to fetch candidate list.");
      } finally {
        setLoading(false);
      }
    };

    const fetchImages = async () => {
      try {
        const response = await fetch(
          `https://d-voting-backend.vercel.app/api/v1/candidate/get-candidate-list`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const res = await response.json();

        if (res.status) {
          const images = res.data.map((candidate) => ({
            imageUrl: candidate.imageUrl,
            accountAddress: candidate.accountAddress,
          }));
          setCandidateImages(images);
        } else {
          setError(res.message);
        }
      } catch (error) {
        setError("Failed to fetch candidate images.");
        toast.error("Failed to fetch candidate images.");
      }
    };

   const fetchVotingTime = async () => {
     try {
       const start = BigInt(await contractInstance.startTime());
       const end = BigInt(await contractInstance.endTime());
 console.log(start, end);
 
       if (start === 0n && end === 0n) {
         setStartTime(null);
         setEndTime(null);
       } else {
         setStartTime(new Date(Number(start) * 1000));
         setEndTime(new Date(Number(end) * 1000));
       }
     } catch (error) {
       console.error("Failed to fetch voting time:", error);
       toast.error("Failed to fetch voting time.");
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

 
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDigitalClock = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

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
      toast.success(`Voted successfully for ${candidate.name}!`);
    } else {
      toast.error("Voting failed.");
    }
  } catch (error) {
    toast.error("Error during voting.");
  } finally {
    setVotingLoading((prev) => ({ ...prev, [candidate.address]: false }));
  }
};


  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-5 text-center">
            Vote for Your Candidate
          </h2>

          <div className="mb-6 p-4 border rounded-lg shadow-md bg-gray-100">
            <h3 className="text-lg font-bold text-gray-500 mb-4 text-center">
              Status: Voting is{" "}
              <span className="text-red-500 font-extrabold">
                "{votingStatus}"
              </span>
            </h3>
            <h3 className="text-lg font-bold text-gray-500 mb-4 text-center">
              Current Time:
              <span className="text-blue-500 font-extrabold clock-display">
                {formatDigitalClock(currentTime)}
              </span>
            </h3>
            <h3 className="text-lg font-bold text-gray-500 mb-4 text-center">
              Start:{" "}
              <span className="text-indigo-500 font-extrabold">
                {startTime ? formatDigitalClock(startTime) : "Not set"}{" "}
              </span>
              End:{" "}
              <span className="text-indigo-500 font-extrabold">
                {endTime  ? formatDigitalClock(endTime) : "Not set"}
              </span>
            </h3>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto divide-y divide-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Party
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Photo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
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
                      <tr key={candidate.address}>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {candidate.name}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-black">
                          {candidate.party.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {getCandidateImage(candidate.address)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <button
                            className={`bg-blue-500 text-white rounded-md px-4 py-2 ${
                              votingLoading[candidate.address]
                                ? "opacity-50"
                                : ""
                            }`}
                            onClick={() => vote(candidate)}
                            disabled={votingLoading[candidate.address]}
                          >
                            {votingLoading[candidate.address]
                              ? "Voting..."
                              : "Vote"}
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
        <ToastContainer />
      </div>
    </Layout>
  );
}

export default Vote;
