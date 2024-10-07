const handleChainChange = async (setWeb3State) => {
  const chainIdHex = await window.ethereum.request({
    method: "eth_chainId",
  });
  const chainId = parseInt(chainIdHex, 16);

  setWeb3State((prevState) => ({ ...prevState, chainId }));
};

export { handleChainChange };
