import { Candidate } from "../../models/Candidate.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteAllCandidates = async (req, res) => {
  try {
    const imageFolderPath = path.join(
      __dirname,
      "../../D-voting/candidateImages"
    );

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

    await Candidate.deleteMany({});

    res.status(200).json({
      status: true,
      message: "All candidates images and data deleted successfully",
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

export { deleteAllCandidates };
