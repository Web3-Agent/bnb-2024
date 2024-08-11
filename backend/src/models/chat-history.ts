import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ChatHistorySchema = new Schema(
    {
        walletAddress: {
            type: String,
            trim: true,
        },
        type: {
            type: String,
            trim: true,
        },
        messages: {
            type: Schema.Types.Mixed,
            default: []
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default model(`chat-history`, ChatHistorySchema, `chat-history`);