import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import StudentProfile from "./StudentProfileModel.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["administrator", "teacher", "student"],
      default: "student",
    },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    if (this.role === "student") {
      await StudentProfile.deleteOne({ userId: this._id });
    }
    next();
  }
);

userSchema.virtual("studentProfile", {
  ref: "StudentProfile",
  localField: "_id",
  foreignField: "userId",
  justOne: true, // One-to-one
});
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

const User = mongoose.model("User", userSchema);
export default User;
