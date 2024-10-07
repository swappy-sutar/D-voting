import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const apiurl = import.meta.env.VITE_WEB_URL;

function GetCandidate() {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [candidateList, setCandidateList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidateImages, setCandidateImages] = useState([]);
  const navigateTo = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigateTo("/");
    }
  }, [navigateTo, token]);

  useEffect(() => {
    const fetchList = async () => {
      try {
        if (!contractInstance) return;

        const candidateAddresses = await contractInstance.getCandidateList();
        console.log("candidateAddresses", candidateAddresses);
        

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
        console.log("candidateDetails", candidateDetails);
        
        setCandidateList(candidateDetails);
        toast.success("Candidate list fetched successfully!");
      } catch (error) {
        setError("Failed to fetch candidate list.");
        toast.error("Failed to fetch candidate list.");
      }
    };

    const fetchImages = async () => {
      try {
        const response = await fetch(
          `${apiurl}/api/v1/candidate/get-candidate-list`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const res = await response.json();
        console.log("res",res);
        

        if (res.status) {
          const images = res.data.map((candidate) => ({
            imageUrl: `${apiurl}/D-voting/candidateImages/${candidate.imageName}`,
            accountAddress: candidate.accountAddress,
          }));
          console.log("images", images);
          
          setCandidateImages(images);
        } else {
          setError(res.message);
        }
      } catch (error) {
        setError("Failed to fetch candidate images.");
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([fetchList(), fetchImages()]);
      setLoading(false);
    };

    fetchAllData();
  }, [contractInstance, navigateTo]);

  const getCandidateImage = (candidateAddress) => {
    const candidateImage = candidateImages.find((image) =>image.accountAddress.toLowerCase() === candidateAddress.toLowerCase());
    
    console.log("candidateImage", candidateImage);
    
    return candidateImage ? (
      <img
        height="70px"
        width="70px"
        src={candidateImage.imageUrl}
        alt="Candidate"
        className="rounded-full"
      />
    ) : (
      <span className="text-gray-500">No Image</span>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Candidate List
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Party
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Photo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidateList.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
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
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {candidate.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {candidate.address}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-500">
                        {candidate.party}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {candidate.gender === 1
                          ? "Male"
                          : candidate.gender === 2
                          ? "Female"
                          : candidate.gender === 3
                          ? "Other"
                          : "Not Specified"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getCandidateImage(candidate.address)}
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
  );
}

export default GetCandidate;
