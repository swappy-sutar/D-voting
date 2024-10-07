import { useContext } from "react";
import { Web3Context } from "./Web3Context";

const useWeb3Context = () => {
  return useContext(Web3Context);
};

export { useWeb3Context };
