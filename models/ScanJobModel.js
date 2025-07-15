import mongoose from "mongoose";

const scanJobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    documentUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      required: true,
    },
    templateId: { type: String },
    pages: { type: Number },
  },
  { timestamps: true }
);

const StudentProfile = mongoose.model("ScanJob", scanJobSchema);
export default StudentProfile;
