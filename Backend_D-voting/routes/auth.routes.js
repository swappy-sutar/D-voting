import express from "express";
import { auth } from "../controllers/Auth/authentication.controller.js";

const router = express.Router();

router.post("/authentication", auth);

export { router };
