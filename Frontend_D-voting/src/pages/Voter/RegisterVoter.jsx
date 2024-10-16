import { useRef, useState, useEffect } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";
import { UploadImage } from "../../utils/UploadImage";
import Layout from "../../Components/Layout";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function RegisterVoter() {
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
  const fileRef = useRef(null);

  const handleVoterRegistration = async (e) => {
    e.preventDefault();
    if (!contractInstance || !selectedAccount) {
      toast.error("Please connect wallet and try again later!");
      navigateTo("/");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User not authenticated.");
        navigateTo("/");
        return;
      }

      // Get form values
      const file = fileRef.current.files[0];
      let imageUrl = "";

      const name = nameRef.current.value;
      const age = parseInt(ageRef.current.value, 10);
      const genderInput = parseInt(genderRef.current.value, 10);

      if (age < 18) {
        toast.error("You are underage");
        return;
      }

      const transaction = await contractInstance.registerVoter(
        name,
        age,
        genderInput
      );

      const receipt = await transaction.wait();

      if (receipt.status === 1) {
        if (file) {
          imageUrl = await UploadImage(file, "voter/voter-image");
        }

        toast.success("Voter registered successfully!");
      } else {
        toast.error("Failed to register candidate");
      }

      nameRef.current.value = "";
      ageRef.current.value = "";
      genderRef.current.value = "";
      fileRef.current.value = "";
    } catch (error) {
      console.error("Error during voter registration:", error || error.message);

      toast.error(`Voter already registered`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="flex items-center m-2 justify-center">
        <form
          onSubmit={handleVoterRegistration}
          className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg space-y-4 md:max-w-md border"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
            Register Voter
          </h2>

          <div>
            <label className="block text-gray-700 font-semibold">Name:</label>
            <input
              type="text"
              ref={nameRef}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Age:</label>
            <input
              type="number"
              ref={ageRef}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your age"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Gender:</label>
            <select
              ref={genderRef}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            } text-white  hover:text-gray-800  font-semibold rounded-md transition duration-300 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500`}
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
            onClick={() => navigateTo("/register-candidate")}
            className=" mt-4 text-center"
          >
            Are you a candidate?{" "}
            <span className="text-blue-500 hover:underline cursor-pointer mt-4 text-center">
              Click here
            </span>
          </p>
        </form>
      </div>
    </Layout>
  );
}

export default RegisterVoter;
