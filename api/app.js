import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

import { facebook } from "./src/facebook.js";
import { emojimix } from "./src/emojimix.js";

const app = express();

app.set("trust proxy", 1);

app.disable("x-powered-by");

app.use(helmet());

app.use(cors({
    origin: "*",
    methods: ["GET"],
    allowedHeaders: ["Content-Type", "Accept"]
}));

app.use(express.json({ limit: "10kb" }));

const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        code: 429,
        author: "Anton",
        msg: "Too many requests"
    }
});

app.use("/api", limiter);

app.get("/api/facebook", async (req, res) => {
    await facebook(req, res);
});

app.get("/api/emojimix", async (req, res) => {
    await emojimix(req, res);
});

app.listen(3000, "0.0.0.0");