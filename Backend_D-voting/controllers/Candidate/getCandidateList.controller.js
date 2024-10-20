import { Candidate } from "../../models/Candidate.model.js";

const getCandidateList = async (req, res) => {
  try {
    const candidateList = await Candidate.find();

    return res.status(200).json({
      status: true,
      message: "Candidate list retrieved successfully",
      data: candidateList,
    });
  } catch (error) {
    console.log("Failed to fetch candidate list", error);
    return res.status(401).json({
      status: false,
      message: "Failed to fetch candidate list",
    });
  }
};

export { getCandidateList }; 
