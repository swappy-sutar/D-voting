import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";

function Home() {
  const [role, setRole] = useState("");
    const navigateTo = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
      if (!token) {
        navigateTo("/");
      }
    }, [navigateTo, token]);



  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleRegister = () => {
    if (role === "Voter") {
      navigateTo("/register-voter");
    } else if (role === "Candidate") {
      navigateTo("/register-candidate");
    } else if (role === "Election-Commision"){
      navigateTo("/login-election-commision");
    }
  };

  return (
    <Layout>
      <div className="relative flex flex-col justify-center items-center h-screen px-4 md:px-8 lg:px-16 ">
        <div className="relative flex flex-col items-center justify-center p-6 w-full max-w-lg bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 text-center">
            Welcome to Voting
          </h1>
          <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-6 text-center">
            Before starting, select your role
          </h3>
          <select
            value={role}
            onChange={handleRoleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out mb-4"
          >
            <option value="" disabled>
              Select your role
            </option>
            <option value="Voter">Voter</option>
            <option value="Candidate">Candidate</option>
            <option value="Election-Commision">Election-Commision</option>
          </select>
          <button
            onClick={handleRegister}
            className="w-full px-6 py-3 mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-lg shadow-md  hover:text-gray-800 "
          >
            Select
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
