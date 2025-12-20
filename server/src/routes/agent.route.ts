import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import authMiddleware, { AuthRequest } from "../middleware/auth.middleware.js";
import { get } from "http";
import { getJWTToken } from "../utils/utility.js";
import Threads from "../model/thread.model.js";
import { agent } from "../graph/index.js";
import { HumanMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";

const agentRouter = express.Router();

agentRouter.post("/query", authMiddleware, async (req, res) => {
    try {
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

        let aiResponseText = result.messages.length
            ? result.messages[result.messages.length - 1]?.content
            : "";
        let hasInterrupt = false;
        if (result.hasOwnProperty("__interrupt__")) {
            hasInterrupt = true;
            aiResponseText = (result as any)?.__interrupt__[0]?.value;
        }

        await Threads.updateOne(
            { threadId: thread_id },
            { $push: { chats: { sender: "A I", content: aiResponseText } } }
        );

        res.status(200).json({
            success: true,
            data: {
                response: aiResponseText,
                hasInterrupt,
            },
            message: "Query processed by ai successfully",
        });
    } catch (error) {
        console.error("Error processing agent query:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default agentRouter;
