import { ethers } from "ethers";
import abi from "../constant/abiV2.json";
import axios from "axios";
const apiurl = import.meta.env.VITE_WEB_URL;


const GetWeb3State = async () => {
  console.log("abi", abi);

  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts.length) {
      throw new Error("No accounts found");
    }

    const selectedAccount = accounts[0];
    console.log("selectedAccount in state", selectedAccount);

    const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
    const chainId = parseInt(chainIdHex, 16);
    console.log("chainId", chainId);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log("signer", signer);

    // const contractAddress = "0x45fB28676998Cf05A5db70b42131011928d054Fc";  //old contract.sol
    const contractAddress = "0x582e28f39e59621B3052150DAc03b785844d9473"; //contractV2.sol deploy on polygon amoy testnet

    console.log("contractAddress", contractAddress);

    const message =
      "Welcome to Voting Dapp. You accept our terms and conditions";
    const signature = await signer.signMessage(message);
    const dataSignature = { signature };
    console.log("Requesting authentication with:", {
      accountAddress: selectedAccount,
      signature: dataSignature.signature,
    });

    const res = await axios.post(
      `${apiurl}/api/v1/auth/authentication?accountAddress=${selectedAccount}`,
      dataSignature
    );
    localStorage.setItem("token", res.data.token);
    console.log("token:", res.data.token);

    let contractInstance;

    try {
      contractInstance = new ethers.Contract(contractAddress, abi, signer);
      console.log("Contract instance created successfully:", contractInstance);
    } catch (error) {
      console.error(
        "Failed to create contract instance:",
        error.message || error
      );
      return;
    }

    if (!contractInstance) {
      console.error("Contract instance not found");
    } else {
      console.log(
        "Contract instance is successfully created:",
        contractInstance
      );

       return { contractInstance, selectedAccount, chainId, signer, provider };
    }
  } catch (error) {
    console.error("Error in GetWeb3State:", error.message || error);
    throw error;
  }
};

export { GetWeb3State };
