import mongoose from "mongoose";

const studentAnswerSchema = new mongoose.Schema(
  {
    examTemplate: { type: mongoose.Schema.Types.ObjectId, ref: "ExamTemplate" },
    originalDocumentUrl: { type: String, required: true },
    originalImagesUrl: [String],
    processedImagesUrl: [String],
    status: {
      type: String,
      enum: ["pending", "processing", "completed"],
      default: "pending",
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const studentAnswer = mongoose.model("StudentAnswer", studentAnswerSchema);
export default studentAnswer;
