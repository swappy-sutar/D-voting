const handleAccountChange = async (setWeb3State) => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const selectedAccount = accounts[0];

      setWeb3State((prevState) => ({ ...prevState, selectedAccount }));
    } catch (error) {
      console.error("Error fetching accounts", error);
    }
  } else {
    console.error("MetaMask is not installed or not detected");
  }
};

export { handleAccountChange };
