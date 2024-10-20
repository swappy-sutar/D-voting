import { Candidate } from "../../models/Candidate.model.js";

const candidateImage = async (req, res) => {
  try {
    const { accountAddress, imageUrl } = req.body;

    if (!accountAddress || !imageUrl) {
      return res.status(400).json({
        status: false,
        message: "Missing accountAddress or imageUrl",
      });
    }

    const newCandidate = await Candidate.create({
      accountAddress,
      imageUrl,
    });

    res.status(200).json({
      status: true,
      message: "Voter registered and image URL saved successfully",
      data: newCandidate,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: false,
      message: "Error while saving candidate image",
      error: error.message,
    });
  }
};

export { candidateImage };
