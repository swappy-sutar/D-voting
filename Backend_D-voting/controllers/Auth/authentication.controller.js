import { ethers } from "ethers";
import jwt from "jsonwebtoken";

const auth = async (req, res) => {
  try {
    const { accountAddress } = req.query;
    const { signature } = req.body;

    if (!accountAddress || !signature) {
      return res.status(401).json({
        status: false,
        message: "Authentication failed",
      });
    }

    const message = "Welcome to Voting Dapp. You accept our terms and conditions";
    const recoverAddress = ethers.utils.verifyMessage(message, signature);

    if (recoverAddress.toLocaleLowerCase() === accountAddress.toLocaleLowerCase()) {
      const token = jwt.sign({ accountAddress }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      console.log("token in auth controller", token);

      return res.status(200).json({
        status: true,
        token: token,
        message: "Authentication successful",
      });
    } else {
      throw new error(" recoverAddress && accountAddress not same");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: false,
      message: "Authentication failed",
    });
  }
};

export { auth };
