import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const getJWTToken = (_id: mongoose.Types.ObjectId) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET as string);
};
