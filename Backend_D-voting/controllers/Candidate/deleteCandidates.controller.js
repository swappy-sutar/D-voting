import { Candidate } from "../../models/Candidate.model.js";

const deleteAllCandidates = async (req, res) => {
  try {
    await Candidate.deleteMany({});

    res.status(200).json({
      status: true,
      message: "All candidates' imageURL's and data deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting candidates' data:", error.message); // Changed log to error
    res.status(500).json({
      status: false,
      message: "Error while deleting candidates' data", // Corrected the message
      error: error.message,
    });
  }
};

export { deleteAllCandidates };
