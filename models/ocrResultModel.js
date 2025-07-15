import mongoose from "mongoose";

const OcrRegionDetailSchema = new mongoose.Schema({
  regionId: String,
  type: {
    type: String,
    enum: ["qr_code", "multiple_choice", "short_answer", "long_answer"],
  },
  page: Number,
  coordinates: {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
  },
  detectAnswer: String,
  confidence: Number,
  isCorrect: Boolean,
  pointsAwarded: Number,
});

const ocrResultSchema = new mongoose.Schema(
  {
    templateId: { type: String },
    answerId: { type: String },
    studentId: { type: String },
    ocrRegions: [OcrRegionDetailSchema],
  },
  { timestamps: true }
);

const OcrResult = mongoose.model("OcrResult", ocrResultSchema);
export default OcrResult;
