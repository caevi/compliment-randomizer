import mongoose from "mongoose";

const LetterViewSchema = new mongoose.Schema(
  {
    letterDate: { type: String, required: true, index: true },
    viewedAt: { type: Date, default: Date.now, index: true },
    userAgent: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.LetterView ||
  mongoose.model("LetterView", LetterViewSchema);
