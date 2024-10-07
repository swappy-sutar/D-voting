import { ethers } from "ethers";
import abi from "../constant/abiV2.json";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiurl = import.meta.env.VITE_WEB_URL;

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

    // const contractAddress = "0x45fB28676998Cf05A5db70b42131011928d054Fc";  //old contract.sol
    const contractAddress = "0x582e28f39e59621B3052150DAc03b785844d9473"; //contractV2.sol deploy on polygon amoy testnet

    const message =
      "Welcome to Voting Dapp. You accept our terms and conditions";
    const signature = await signer.signMessage(message);
    const dataSignature = { signature };

    const res = await axios.post(
      `${apiurl}/api/v1/auth/authentication?accountAddress=${selectedAccount}`,
      dataSignature
    );
    localStorage.setItem("token", res.data.token);

    let contractInstance;

    try {
      contractInstance = new ethers.Contract(contractAddress, abi, signer);
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
    } else {
      toast.success("Contract instance created successfully");

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
