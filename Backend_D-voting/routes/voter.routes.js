import express from "express";
import { voterImage } from "../controllers/Voter/voterImage.controller.js";
import { getVoterList } from "../controllers/Voter/getVoterList.controller.js";
import {deleteAllVoters} from "../controllers/Voter/deleteVoters.controller.js"

const router = express.Router();

router.post("/voter-image", voterImage);
router.get("/get-voter-list", getVoterList);
router.delete("/delete-All-Voters", deleteAllVoters);


export { router };
