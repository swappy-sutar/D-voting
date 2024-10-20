import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../Layout";

function Login() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const username = usernameRef.current.value;
      const password = passwordRef.current.value;

      const response = await fetch(
        "http://localhost:8000/api/v1/electoion-Commission/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful!");
        navigateTo("/election-commission");
        usernameRef.current.value = "";
        passwordRef.current.value = "";
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <Layout>
      <div className="flex items-center my-14 mx-2 justify-center">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg space-y-4 md:max-w-md border"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
            Login for E-Commission
          </h2>
          <div>
            <label className="block text-gray-700 font-semibold">
              Username:
            </label>
            <input
              type="text"
              ref={usernameRef}
              required
              placeholder="Enter your username"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Password:
            </label>
            <input
              type="password"
              ref={passwordRef}
              required
              placeholder="Enter your password"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>

        <ToastContainer />
      </div>
    </Layout>
  );
}

export default Login;
