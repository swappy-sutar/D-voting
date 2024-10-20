import { Voter } from "../../models/voter.model.js";

const deleteAllVoters = async (req, res) => {
  try {
    await Voter.deleteMany({});
    res.status(200).json({
      status: true,
      message: "All voter imageURL's and data deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting voter data:", error.message); 
    res.status(500).json({
      status: false,
      message: "Error while deleting voter data",
      error: error.message, 
    });
  }
};

export { deleteAllVoters };
