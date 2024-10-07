import mongoose, { Schema } from "mongoose";

const CandidateSchema = new Schema(
  {
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

export const Candidate = mongoose.model("Candidate", CandidateSchema);
