import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Layout from "../../Components/Layout";

function GetVoter() {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [voterList, setVoterList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voterImages, setVoterImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [votersPerPage] = useState(5); 
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

       const voterAddresses = await contractInstance.getVoterList();
       if (voterAddresses.length === 0) {
         toast.error("No Voters Available");
         return;
       }

       const voterDetails = await Promise.all(
         voterAddresses.map(async (address) => {
           const voter = await contractInstance.getVoter(address);
           return {
             address,
             name: voter[0],
             age: Number(voter[1]),
             gender: Number(voter[2]),
           };
         })
       );
       setVoterList(voterDetails);
     } catch (error) {
       console.error(error);
       setError("Failed to fetch voter list.");
       toast.error("Failed to fetch voter list.");
     }
   };

   const fetchImages = async () => {
     try {
       const response = await fetch(
         `https://d-voting-backend.vercel.app/api/v1/voter/get-voter-list`,
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
         const images = res.data.map((voter) => ({
           imageUrl: voter.imageUrl,
           accountAddress: voter.accountAddress,
         }));
         setVoterImages(images);
       } else {
         setError(res.message);
       }
     } catch (error) {
       setError("Failed to fetch voter images.");
     }
   };

   const fetchAllData = async () => {
     setLoading(true);
     await Promise.all([fetchList(), fetchImages()]);
     setLoading(false);
     toast.success("Voter fetched successfully!");
   };

   fetchAllData();
 }, [contractInstance, token]);


  const getVoterImage = (voterAddress) => {
    const voterImage = voterImages.find(
      (image) =>
        image.accountAddress.toLowerCase() === voterAddress.toLowerCase()
    );
    return voterImage ? (
      <img
        src={voterImage.imageUrl}
        alt="voter"
        className="w-16 h-16 rounded-full object-cover shadow-2xl"
      />
    ) : (
      <span>No Image</span>
    );
  };


  const indexOfLastVoter = currentPage * votersPerPage; 
  const indexOfFirstVoter = indexOfLastVoter - votersPerPage; 
  const currentVoters = voterList.slice(indexOfFirstVoter, indexOfLastVoter);
  const totalPages = Math.ceil(voterList.length / votersPerPage); 

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <ToastContainer />
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-10 text-center">
            Voter List
          </h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Photo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentVoters.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-600"
                      >
                        No voters found.
                      </td>
                    </tr>
                  ) : (
                    currentVoters.map((voter, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-100 transition-colors duration-300"
                      >
                        <td className="px-5 py-4 text-sm font-medium text-gray-900 h-20">
                          {indexOfFirstVoter + index + 1}{" "}
                          {/* Correct ID display */}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 h-20">
                          {voter.name}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 h-20">
                          {voter.address}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 h-20">
                          {voter.age}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 h-20">
                          {voter.gender === 1
                            ? "Male"
                            : voter.gender === 2
                            ? "Female"
                            : voter.gender === 3
                            ? "Other"
                            : "Not Specified"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 h-20 flex items-center">
                          {getVoterImage(voter.address)}
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
              onClick={handlePrevPage}
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
              onClick={handleNextPage}
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

export default GetVoter;
