import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";

const app: Express = express();

app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://friends-association-plum.vercel.app",
    ],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Association Saving App Backend Running..." });
});

export default app;
