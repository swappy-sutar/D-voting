import express from "express";
import { voterImage } from "../controllers/Voter/voterImage.controller.js";
import { voterUpload } from "../middlewares/multer.middlerware.js";
import { getVoterList } from "../controllers/Voter/getVoterList.js";

const router = express.Router();

router.post("/voter-image", voterUpload, voterImage);
router.get("/get-voter-list", getVoterList);


export { router };
