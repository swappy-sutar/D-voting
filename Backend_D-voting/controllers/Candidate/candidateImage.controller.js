import { Candidate } from "../../models/Candidate.model.js";


const candidateImage = async (req, res) => {
  try {
    const accountAddress = req.accountAddress; 
    const imageName = req.file.filename;

    if (!accountAddress || !imageName) {
      return res.status(400).json({
        status: false,
        message: "Missing accountAddress or imageName",
      });
    }

    const saveCandidate = await Candidate.create({
      accountAddress: accountAddress,
      imageName: imageName,
    });

    res.status(200).json({
      status: true,
      message: "Candidate image saved successfully",
      data: saveCandidate,
      imageUrl: `/D-voting/candidateImages/${imageName}`, 
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
