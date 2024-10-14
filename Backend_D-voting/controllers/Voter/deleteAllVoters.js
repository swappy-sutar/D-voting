import { Voter } from "../../models/voter.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteAllVoters = async (req, res) => {
  try {
    const imageFolderPath = path.join(__dirname, "../../D-voting/voterImages");

    fs.readdir(imageFolderPath, (err, files) => {
      if (err) {
        console.error("Unable to scan directory:", err);
        return res.status(500).json({
          status: false,
          message: "Error while deleting images from the folder",
          error: err.message,
        });
      }

      files.forEach((file) => {
        fs.unlink(path.join(imageFolderPath, file), (err) => {
          if (err) {
            console.error(`Error deleting file ${file}:`, err);
          }
        });
      });
    });

    await Voter.deleteMany({});

    res.status(200).json({
      status: true,
      message: "All voter images and data deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error while deleting voter data",
      error: error.message,
    });
  }
};

export { deleteAllVoters };
