import { Voter } from "../../models/voter.model.js";

const getVoterList = async (req, res) => {
  try {
    const voterList = await Voter.find();

    console.log(voterList);

    return res.status(200).json({
      status: true,
      message: "Voter list retrieved successfully",
      data: voterList,
    });
  } catch (error) {
    console.log("Failed to fetch voter list", error);
    return res.status(401).json({
      status: false,
      message: "Failed to fetch voter list",
    });
  }
};

export { getVoterList };
