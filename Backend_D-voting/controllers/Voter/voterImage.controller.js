import { Voter } from "../../models/voter.model.js";

const voterImage = async (req, res) => {
  try {

    const accountAddress = req.accountAddress;
    const imageName = req.file.filename;

   if (!accountAddress || !imageName) {
     return res.status(400).json({
       status: false,
       message: "Missing accountAddress or imageName",
     });
   }

   console.log("data",{
    accountAddress,
    imageName
   });
   

   const saveCandidate = await Voter.create({
     accountAddress: accountAddress,
     imageName: imageName,
   });

   res.status(200).json({
     status: true,
     message: "Candidate image saved successfully",
     data: saveCandidate,
     imageUrl: `/D-voting/voterImages/${imageName}`,
   });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Error while saving Voter image",
      error: error.message,
    });
  }
};

export { voterImage };
