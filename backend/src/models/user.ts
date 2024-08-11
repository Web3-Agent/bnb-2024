import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userNonceSchema = new Schema(
  {
    walletAddress: {
      type: String,
      trim: true,
    },
    nonce: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default model(`user-nonce`, userNonceSchema, `user-nonce`);