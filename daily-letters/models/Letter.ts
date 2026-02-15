import mongoose from "mongoose";

const LetterSchema = new mongoose.Schema(
  {
    // Use YYYY-MM-DD format (ex: 2026-02-14)
    date: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Letter || mongoose.model("Letter", LetterSchema);
