import React, { useRef, useState, useEffect } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";
import { UploadImage } from "../../utils/UploadImage";
import Layout from "../../Components/Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

function RegisterCandidate() {
  const { web3State } = useWeb3Context();
  const { contractInstance, selectedAccount } = web3State;
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigateTo("/");
    }
  }, [navigateTo, token]);

  const nameRef = useRef(null);
  const ageRef = useRef(null);
  const genderRef = useRef(null);
  const partyRef = useRef(null);
  const depositRef = useRef(null);
  const fileRef = useRef(null);

  const handleCandidateRegistration = async (e) => {
    e.preventDefault();

    if (!contractInstance || !selectedAccount) {
      toast.error("Please connect wallet and try again later!");
      navigateTo("/");
      return;
    }

    setLoading(true);

    try {
      const file = fileRef.current.files[0];
      let imageUrl = "";

      const name = nameRef.current.value;
      const age = parseInt(ageRef.current.value, 10);
      const genderValue = parseInt(genderRef.current.value, 10);
      const party = partyRef.current.value;
      const valueEth = depositRef.current.value;

      if (parseFloat(valueEth) < 0.001) {
        toast.error("Deposit amount should be 0.001 ETH or more.");
        setLoading(false);
        return;
      }

      const valueWei = ethers.parseEther(valueEth);

      if (age < 18) {
        toast.error("You are underage");
        setLoading(false);
        return;
      }

      const transaction = await contractInstance.registerCandidate(
        name,
        party,
        age,
        genderValue,
        {
          value: valueWei,
          gasLimit: 300000,
        }
      );

      const receipt = await transaction.wait();
      if (receipt.status === 1) {
        toast.success("Candidate registered successfully!");
        if (file) {
          imageUrl = await UploadImage(file, "candidate/candidate-image");
        }
      } else {
        toast.error("Failed to register candidate");
      }

      nameRef.current.value = "";
      ageRef.current.value = "";
      genderRef.current.value = "";
      partyRef.current.value = "";
      depositRef.current.value = "";
      fileRef.current.value = "";
    } catch (error) {
      console.error("Error during candidate registration:", error.message);
      toast.error(`Error during registration: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="flex items-center my-14 mx-2 justify-center ">
        <form
          onSubmit={handleCandidateRegistration}
          className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg space-y-4 md:max-w-md border"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
            Register Candidate
          </h2>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-2 rounded-md mb-4">
            <strong>Note:</strong> Deposit amount should be "0.001" ETH/MATIC
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-gray-700 font-semibold">Name:</label>
            <input
              type="text"
              ref={nameRef}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter candidate's name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Age:</label>
            <input
              type="number"
              ref={ageRef}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter candidate's age"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Gender:</label>
            <select
              ref={genderRef}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="1">Male</option>
              <option value="2">Female</option>
              <option value="3">Other</option>
              <option value="0">Not Specified</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Party:</label>
            <input
              type="text"
              ref={partyRef}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter candidate's party"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Deposit:
            </label>
            <input
              type="text"
              ref={depositRef}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Deposit 0.001 ETH/MATIC"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">
              Upload Image:
            </label>
            <input
              type="file"
              ref={fileRef}
              className="mt-1 w-full px-4 py-1 border border-gray-300 rounded-md bg-white text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 ${
              loading ? "bg-gray-400" : "bg-blue-600"
            } text-white hover:${
              loading ? "text-gray-800" : "hover:text-gray-800"
            } font-semibold rounded-md transition duration-300 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500`}
          >
            {loading ? (
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
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>

          <p
            onClick={() => navigateTo("/register-voter")}
            className="mt-4 text-center"
          >
            Are you a voter?{" "}
            <span className="text-blue-500 hover:underline cursor-pointer mt-4 text-center">
              Click here
            </span>
          </p>
        </form>
      </div>
    </Layout>
  );
}

export default RegisterCandidate;
