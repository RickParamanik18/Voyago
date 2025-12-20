import mongoose, { Document, Schema } from "mongoose";

export interface ThreadSchema extends Document {
    threadId: string;
    name: string;
    chats: object[];
}

const threadSchema: Schema<ThreadSchema> = new Schema(
    {
        threadId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            default: "Untitled",
        },
        chats: {
            type: [Object],
            default: [],
        },
    },
    { timestamps: true }
);

export default mongoose.model<ThreadSchema>("Threads", threadSchema);
