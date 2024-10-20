import express from "express";
import { candidateImage } from "../controllers/Candidate/candidateImage.controller.js";
import { getCandidateList } from "../controllers/Candidate/getCandidateList.controller.js";
import { deleteAllCandidates } from "../controllers/Candidate/deleteCandidates.controller.js";



const router = express.Router();

router.post("/candidate-image", candidateImage); 
router.get("/get-candidate-list",getCandidateList);
router.delete("/delete-All-Candidates", deleteAllCandidates);

export { router };
