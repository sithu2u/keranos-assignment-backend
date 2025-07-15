import StudentProfile from "../../models/StudentProfileModel.js";
import User from "../../models/UserModel.js";

const selectQueryOptions = "-password -__v";

const createStudentProfile = async (data) => {
  const { userId, studentId, className, section } = data;
  const studentProfile = new StudentProfile({
    userId,
    studentId,
    className,
    section,
  });
  return await studentProfile.save();
};

const getStudentProfileByUserID = async (userId) => {
  return await StudentProfile.findOne({ userId });
};

const findStudentProfileByStudentId = async (studentId) => {
  return await StudentProfile.findOne({ studentId });
};

const findAllStudents = async (userId) => {
  return await User.find({ role: "student" })
    .select(selectQueryOptions)
    .populate("studentProfile");
};

const findOneStudentByUserId = async (id) => {
  return await User.find({ role: "student", _id: id })
    .select(selectQueryOptions)
    .populate("studentProfile");
};

const updateStudentProfile = async (id, updates) => {
  const stuendtProfile = await StudentProfile.findById(id);
  if (!stuendtProfile) {
    throw new Error("profile not found");
  }
  Object.keys(updates).forEach((key) => {
    stuendtProfile[key] = updates[key];
  });

  await stuendtProfile.save();
  return stuendtProfile;
};

export default {
  createStudentProfile,
  getStudentProfileByUserID,
  findStudentProfileByStudentId,
  findAllStudents,
  findOneStudentByUserId,
  updateStudentProfile,
};
