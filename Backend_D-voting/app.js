import express from "express";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "https://d-voting-swappy.vercel.app"],
  methods: ["POST", "GET", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.options("*", cors());

import { auth } from "./middlewares/auth.middleware.js";
import { router as candidate } from "./routes/candidate.Routes.js";
import { router as voter } from "./routes/voter.routes.js";
import { router as Authentication } from "./routes/auth.routes.js";
import { router as electionCommission } from "./routes/election-Commission.routes.js";

app.use("/api/v1/auth", Authentication);
app.use("/api/v1/candidate", auth, candidate);
app.use("/api/v1/voter", auth, voter);
app.use("/api/v1/election-Commission", auth, electionCommission);

export { app };
