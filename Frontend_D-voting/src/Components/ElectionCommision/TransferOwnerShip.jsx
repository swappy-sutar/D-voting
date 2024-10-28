import React, { useState, useRef } from "react";
import { useWeb3Context } from "../../context/UseWeb3Context";
import { isAddress } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TransferOwnerShip() {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [isTransferring, setIsTransferring] = useState(false);
  const newOwnerRef = useRef(null);

  const handleChangeOwner = async (e) => {
    e.preventDefault();
    const newOwner = newOwnerRef.current.value;

    if (!isAddress(newOwner)) {
      toast.error("Invalid recipient address!");
      return;
    }

    setIsTransferring(true);

    try {
      const transaction = await contractInstance.transferOwnerShip(newOwner);
      const receipt = await transaction.wait();

      if (receipt.status === 1) {
        toast.success("Transaction successful!");
      } else {
        toast.error("Transaction failed");
      }

      newOwnerRef.current.value = "";
    } catch (error) {
      console.error("Error while transferring ownership", error);
      toast.error("Permission denied: Not election commissioner");
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg shadow-md bg-gray-100 p-6">
      <h2 className="text-xl font-bold mb-4">
        Change E-Commissioner Ownership
      </h2>

      <form
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center"
        onSubmit={handleChangeOwner}
      >
        <input
          type="text"
          placeholder="New Owner Address"
          required
          ref={newOwnerRef}
          className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
        />

        <button
          type="submit"
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

export default TransferOwnerShip;
