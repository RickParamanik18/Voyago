import express from "express";
import "dotenv/config";
import cors from "cors";
import { agent } from "./graph/index.js";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";
import authRouter from "./routes/auth.route.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(cookieParser());

app.use("/api/auth", authRouter);

app.get("/", (req, res) =>
    res.json({ success: true, message: "Hello From Server.." })
);

app.get("/api/me", (req, res) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Not Authorized" });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as any;

        return res.json({
            success: true,
            data: decoded,
        });
    } catch (err) {
        return res
            .status(401)
            .json({ success: false, message: "Invalid token" });
    }
});

app.post("/query", async (req, res) => {
    const { query: userMsg, thread_id, resume } = req.body;
    if (!thread_id)
        res.status(400).json({
            success: false,
            message: "thread_id Required!!",
        });

    const config = {
        configurable: {
            thread_id,
        },
    };
    let result = null;
    if (resume) {
        result = await agent.invoke(new Command({ resume }), config);
        // result = await agent.getState(thread_id);
    } else {
        result = await agent.invoke(
            {
                messages: [new HumanMessage(userMsg)],
            },
            config
        );
    }
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
});
