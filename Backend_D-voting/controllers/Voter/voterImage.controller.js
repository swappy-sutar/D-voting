import { Voter } from "../../models/voter.model.js";

const voterImage = async (req, res) => {
  try {
    const { accountAddress, imageUrl } = req.body;

    if (!accountAddress || !imageUrl) {
      return res.status(400).json({
        status: false,
        message: "Missing accountAddress or imageUrl",
      });
    }

    const newVoter = await Voter.create({
      accountAddress,
      imageUrl,
    });

    res.status(200).json({
      status: true,
      message: "Voter registered and image URL saved successfully",
      data: newVoter,
    });
  } catch (error) {
    console.error("Error saving voter image", error);
    res.status(400).json({
      status: false,
      message: "Error saving voter image",
      error: error.message,
    });
  }
};

export { voterImage };
