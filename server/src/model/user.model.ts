import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    threads: string[];
}

const userSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        threads: {
            type: [String],
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("Users", userSchema);
