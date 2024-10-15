import express from "express";
import path from "path"; // Import path
import { fileURLToPath } from "url";
import cors from "cors";
import { auth } from "./middlewares/auth.middleware.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: [
    "https://d-voting-v1.vercel.app",
    "https://d-voting-omdk.vercel.app",
  ],
  methods: ["POST", "GET", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/D-voting", express.static(path.join(__dirname, "D-voting")));

// Define routes
import { router as candidate } from "./routes/candidate.Routes.js";
import { router as voter } from "./routes/voter.routes.js";
import { router as Authentication } from "./routes/auth.routes.js";
import { home } from "./controllers/home.controller.js";

app.options("*", cors()); 

// Use routes
app.use("/",home);
app.use("/api/v1/auth", Authentication);
app.use("/api/v1/candidate", auth, candidate);
app.use("/api/v1/voter", auth, voter);

export { app };
