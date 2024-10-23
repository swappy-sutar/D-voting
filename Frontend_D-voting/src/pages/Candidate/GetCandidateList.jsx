import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";
import { useNavigate } from "react-router-dom";
import Layout from "../../Components/Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GetCandidate() {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [candidateList, setCandidateList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidateImages, setCandidateImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 5;
  const navigateTo = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigateTo("/");
  }, [navigateTo, token]);

  useEffect(() => {
    const fetchCandidatesData = async () => {
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

    fetchCandidatesData();
    fetchImages();
  }, [contractInstance, token]);

  const getCandidateImage = (candidateAddress) => {
    const candidateImage = candidateImages.find(
      (image) =>
        image.accountAddress.toLowerCase() === candidateAddress.toLowerCase()
    );
    return candidateImage ? (
      <img
        src={candidateImage.imageUrl}
        alt="Candidate"
        className="w-16 h-16 rounded-full object-cover shadow-2xl"
      />
    ) : (
      <span className="text-gray-500 italic">No Image</span>
    );
  };

  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = candidateList.slice(
    indexOfFirstCandidate,
    indexOfLastCandidate
  );
  const totalPages = Math.ceil(candidateList.length / candidatesPerPage);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <ToastContainer />
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-10 text-center">
            Candidate List
          </h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto divide-y divide-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    {["ID", "Name", "Address", "Party", "Gender", "Photo"].map(
                      (header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCandidates.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-600"
                      >
                        No candidates found.
                      </td>
                    </tr>
                  ) : (
                    currentCandidates.map((candidate, index) => (
                      <tr
                        key={candidate.address}
                        className="hover:bg-gray-100 transition-colors duration-300"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {indexOfFirstCandidate + index + 1}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 h-20">
                          {candidate.name}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 h-20">
                          {candidate.address}
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-gray-500 h-20">
                          {candidate.party}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 h-20">
                          {candidate.gender === 1
                            ? "Male"
                            : candidate.gender === 2
                            ? "Female"
                            : "Other"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 h-20 flex items-center">
                          {getCandidateImage(candidate.address)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-white font-semibold bg-blue-600 rounded-lg shadow-md transition duration-300 ease-in-out transform ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-500"
              }`}
            >
              Previous
            </button>
            <span className="text-lg font-semibold text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 text-white font-semibold bg-blue-600 rounded-lg shadow-md transition duration-300 ease-in-out transform ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-500"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default GetCandidate;
