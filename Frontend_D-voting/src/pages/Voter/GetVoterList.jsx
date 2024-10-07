import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Log } from "ethers";

const apiurl = import.meta.env.VITE_WEB_URL;

function GetVoter() {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [voterList, setVoterList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voterImages, setVoterImages] = useState([]);
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
        console.log("voterAddresses", voterAddresses);
        

        if (voterAddresses.length === 0) {
          toast.error("No Candidates Available");
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
        console.log("voterDetails", voterDetails);
        setVoterList(voterDetails);
        toast.success("Voter list fetched successfully!");
      } catch (error) {
        console.error(error);
        setError("Failed to fetch voter list.");
        toast.error("Failed to fetch voter list.");
      }
    };

    const fetchImages = async () => {
      try {
        const response = await fetch(`${apiurl}/api/v1/voter/get-voter-list`, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
            Authorization: `Bearer ${token}`,
          },
        });
        const res = await response.json();
        console.log("res", res);

        if (res.status) {
          const images = res.data.map((voter) => ({
            imageUrl: `${apiurl}/D-voting/voterImages/${voter.imageName}`,
            accountAddress: voter.accountAddress,
          }));
          console.log("images", images);
          
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
    };

    fetchAllData();
  }, [contractInstance, navigateTo]);

  const getVoterImage = (voterAddress) => {
    const voterImage = voterImages.find(
      (image) =>
        image.accountAddress.toLowerCase() === voterAddress.toLowerCase()
    );
    return voterImage ? (
      <img
        height="70px"
        width="70px"
        src={voterImage.imageUrl}
        alt="voter"
        className="rounded-full"
      />
    ) : (
      <span>No Image</span>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <ToastContainer />
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Voter List
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
                    photo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {voterList.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-600"
                    >
                      No voters found.
                    </td>
                  </tr>
                ) : (
                  voterList.map((voter, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-100 transition-colors duration-300"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {voter.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {voter.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {voter.age}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {voter.gender === 1
                          ? "Male"
                          : voter.gender === 2
                          ? "Female"
                          : voter.gender === 3
                          ? "Other"
                          : "Not Specified"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getVoterImage(voter.address)}
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

export default GetVoter;
