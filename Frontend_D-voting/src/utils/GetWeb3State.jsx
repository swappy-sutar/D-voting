import { ethers } from "ethers";
import abi from "../constant/abi.json";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const GetWeb3State = async () => {
  try {
    if (!window.ethereum) {
      toast.error("MetaMask is not installed");
      throw new Error("MetaMask is not installed");
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts.length) {
      toast.error("No accounts found");
      throw new Error("No accounts found");
    }

    const selectedAccount = accounts[0];

    const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
    const chainId = parseInt(chainIdHex, 16);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contractAddress = "0xD88346AA5a16724A39E5976724342455AAEE3DFA"; 

    const message =
      "Welcome to Voting Dapp. You accept our terms and conditions";
    const signature = await signer.signMessage(message);
    const dataSignature = { signature };

    const res = await axios.post(
      `https://d-voting-backend.vercel.app/api/v1/auth/authentication?accountAddress=${selectedAccount}`,
      dataSignature
    );
   
    localStorage.setItem("token", res.data.token);
  
    let contractInstance;

    try {
      contractInstance = new ethers.Contract(contractAddress, abi, signer);
      console.log("create contract instance successfully");
      
    } catch (error) {
      toast.error("Failed to create contract instance");
      console.error(
        "Failed to create contract instance:",
        error.message || error
      );
      return;
    }

    if (!contractInstance) {
      toast.error("Contract instance not found");
      console.error("Contract instance not found");
    } else {

      return { contractInstance, selectedAccount, chainId, signer, provider };
    }
  } catch (error) {
    toast.error(`Error: ${error.message || error}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
    console.error("Error in GetWeb3State:", error.message || error);
    throw error;
  }
};

export { GetWeb3State };
