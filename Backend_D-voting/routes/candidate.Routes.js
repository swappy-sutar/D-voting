import express from "express";
import { candidateImage } from "../controllers/Candidate/candidateImage.controller.js";
import { candidateUpload } from "../middlewares/multer.middlerware.js";
import { getCandidateList } from "../controllers/Candidate/getCandidateList.js";



const router = express.Router();

router.post("/candidate-image", candidateUpload, candidateImage); 
router.get("/get-candidate-list",getCandidateList)

export { router };
