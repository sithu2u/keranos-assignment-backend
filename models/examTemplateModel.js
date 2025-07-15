import mongoose from "mongoose";

const regionSchema = new mongoose.Schema({
  regionLabel: { type: String, required: true },
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
  options: [String],
  correctAnswer: String,
  rubricAnswer: String,
  points: Number,
});

const examTemplateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    documentUrl: { type: String, required: true },
    pages: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed"],
      default: "pending",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    regions: [regionSchema],
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ExamTemplate = mongoose.model("ExamTemplate", examTemplateSchema);
export default ExamTemplate;
