import mongoose from "mongoose";
const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    studentId: { type: String, required: true, unique: true },
    className: { type: String },
    section: { type: String },
  },
  { timestamps: true }
);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);
export default StudentProfile;
