import React, { useRef, useState } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";
import { parseEther, isAddress } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TransferETH() {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;

  const recipientRef = useRef(null);
  const amountRef = useRef(null);

  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async (e) => {
    e.preventDefault();
    const recipient = recipientRef.current.value;
    const amount = amountRef.current.value;

    if (!isAddress(recipient)) {
      toast.error("Invalid recipient address!");
      return;
    }

    const amountInWei = parseEther(amount);

    const contractBalance = await contractInstance.electionCommissionBalance();

    if (contractBalance <= amountInWei) {
      toast.error("Insufficient balance, Please check contract balance!");
    } else {
      setIsTransferring(true);
      try {
        const transaction = await contractInstance.transferETH(
          recipient,
          amountInWei
        );

        const receipt = await transaction.wait();

        if (receipt.status === 1) {
          toast.success("Transaction successful!");
        } else {
          toast.error("Transaction failed");
        }

        recipientRef.current.value = "";
        amountRef.current.value = "";
      } catch (error) {
        toast.error("Permission denied: Not election commissioner");
      } finally {
        setIsTransferring(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg shadow-md bg-gray-100 p-6">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4">Transfer From Contract</h2>

      <form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <input
          type="text"
          placeholder="Recipient Address"
          required
          ref={recipientRef}
          className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Amount in ETH"
          required
          ref={amountRef}
          className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
        />
        <button
          onClick={handleTransfer}
          className={`px-6 py-3 text-white font-semibold rounded-lg shadow-lg transition duration-300 ${
            isTransferring ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          } w-full`}
          disabled={isTransferring}
        >
          {isTransferring ? "Transferring..." : "Transfer"}
        </button>
      </form>
    </div>
  );
}

export default TransferETH;
