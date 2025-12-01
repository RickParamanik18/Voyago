import express from "express";
import "dotenv/config";
import cors from "cors";
import { agent } from "./graph/index.js";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) =>
    res.json({ success: true, message: "Hello From Server.." })
);

app.post("/query", async (req, res) => {
    const userMsg = req.body.query;
    if (!userMsg)
        res.status(400).json({
            success: false,
            message: "User Query Required!!",
        });
    const result = await agent.invoke({
        messages: [new HumanMessage(userMsg)],
    });
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
});
