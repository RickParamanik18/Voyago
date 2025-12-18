import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import authMiddleware, { AuthRequest } from "../middleware/auth.middleware.js";
import { get } from "http";
import { getJWTToken } from "../utils/utility.js";
import mongoose from "mongoose";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
};

const userRouter = express.Router();

userRouter.put(
    "/add_thread",
    authMiddleware,
    async (req: AuthRequest, res: Response) => {
        try {
            const { thread_id } = req.body as {
                thread_id: string;
            };

            if (!thread_id) {
                return res.status(400).json({
                    success: false,
                    message: "Required arguments not found!!",
                });
            }

            const user = (await User.findByIdAndUpdate(
                req.user!._id,
                { $push: { threads: thread_id } },
                { new: true }
            )) as mongoose.Document;

            const token = getJWTToken(user._id);

            res.cookie("authToken", token, cookieOptions);

            return res.status(201).json({
                success: true,
                message: "New Chat Added Successfully",
                data: user,
            });
        } catch (error: any) {
            return res
                .status(500)
                .json({ success: false, message: error.message });
        }
    }
);

export default userRouter;
