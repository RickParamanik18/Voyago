import express, { Request, Response } from "express";
import Threads from "../model/thread.model.js";
import authMiddleware, { AuthRequest } from "../middleware/auth.middleware.js";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
};

const threadRouter = express.Router();

threadRouter.post(
    "/get-messages",
    authMiddleware,
    async (req: AuthRequest, res: Response) => {
        try {
            const { threadId } = req.body as {
                threadId: string;
            };

            if (!threadId) {
                return res.status(400).json({
                    success: false,
                    message: "Required arguments not found!!",
                });
            }

            const data = await Threads.findOne({ threadId });

            return res.status(201).json({
                success: true,
                message: "Chat thread fetched successfully",
                data,
            });
        } catch (error: any) {
            return res
                .status(500)
                .json({ success: false, message: error.message });
        }
    }
);

threadRouter.post(
    "/add-message",
    authMiddleware,
    async (req: AuthRequest, res: Response) => {
        try {
            const { threadId, message } = req.body as {
                threadId: string;
                message: object;
            };

            if (!threadId) {
                return res.status(400).json({
                    success: false,
                    message: "Required arguments not found!!",
                });
            }

            await Threads.updateOne(
                { threadId },
                { $push: { chats: message } }
            );

            return res.status(201).json({
                success: true,
                message: "Chat added to thread successfully",
            });
        } catch (error: any) {
            return res
                .status(500)
                .json({ success: false, message: error.message });
        }
    }
);

export default threadRouter;
