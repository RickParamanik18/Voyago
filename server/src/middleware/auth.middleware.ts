import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    _id: string;
    name: string;
    threads: string[];
    iat: number;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.authToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token missing",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export default authMiddleware;
