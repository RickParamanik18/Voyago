import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import { getJWTToken } from "../utils/utility.js";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
};

const authRouter = express.Router();

authRouter.post("/signup", async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body as {
            name: string;
            email: string;
            password: string;
        };

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(409)
                .json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = getJWTToken(user._id);
        res.cookie("authToken", token, cookieOptions);

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            data: user,
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

authRouter.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as {
            email: string;
            password: string;
        };

        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }

        const token = getJWTToken(user._id);
        res.cookie("authToken", token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: user,
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default authRouter;
