import express from "express";
import { login } from "../controllers/Electoion-Commission/login.controller.js";

const router = express.Router();

router.post("/login", login);

export { router };
