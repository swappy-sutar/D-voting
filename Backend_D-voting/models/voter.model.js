import mongoose, { Schema } from "mongoose";

const voterSchema = new Schema({
    accountAddress: {
      type: String,
      required: true,
    },
    imageName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Voter = mongoose.model("Voter",voterSchema)