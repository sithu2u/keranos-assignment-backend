import User from "../models/UserModel.js";
import StudentProfile from "../models/StudentProfileModel.js";
import {
  createStudentProfileSchema,
  updateStudentProfileSchema,
} from "../validations/studentProfile.js";
import { validateRequest } from "../utils/validateRequest.js";
import userService from "../providers/users/user.service.js";
import studentService from "../providers/students/student.service.js";
import { extractValidationErrors } from "../utils/extractValidationErrors.js";
import { validateObjectId } from "../utils/validateObjectId.js";

// Create student and profile
export const createStudentProfile = async (req, res) => {
  try {
    // Validate the request body with schema
    const { error, value } = validateRequest(
      createStudentProfileSchema,
      req.body
    );
    if (error) {
      const err = extractValidationErrors(error);
      return res.status(400).json({ errors: err });
    }

    const { userId, studentId, className, section } = value;

    const user = await userService.getUserByID(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "student")
      return res
        .status(400)
        .json({ message: "Student profile can only create with student role" });

    const existingDataWithStudentId =
      await studentService.findStudentProfileByStudentId(studentId);
    if (existingDataWithStudentId)
      return res.status(400).json({ message: "Student Id already exists" });

    const existingUserWithUserID =
      await studentService.getStudentProfileByUserID(userId);
    if (existingUserWithUserID)
      return res
        .status(400)
        .json({ message: "Student profile already created" });

    const profile = await studentService.createStudentProfile(value);

    res.status(201).json({ profile });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await studentService.findAllStudents();
    res.json(students);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get student by ID
export const getStudentByUserId = async (req, res) => {
  if (!validateObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid Request" });

  try {
    const student = await studentService.findOneStudentByUserId(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update student profile
export const updateStudentProfile = async (req, res) => {
  if (!validateObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid Request" });

  try {
    const { error, value } = validateRequest(
      updateStudentProfileSchema,
      req.body
    );

    if (error) {
      const err = extractValidationErrors(error);
      return res.status(400).json({ errors: err });
    }
    const { studentId } = value;

    if (studentId) {
      const existStudentProfileWithStudentId =
        await studentService.findStudentProfileByStudentId(
          req.params.id,
          studentId
        );
      if (existStudentProfileWithStudentId)
        return res
          .status(400)
          .json({ message: "Student Id already used by someone" });
    }

    const studentProfile = await studentService.updateStudentProfile(
      req.params.id,
      value
    );

    res.json({
      message: "User information has been updated",
      studentProfile,
    });
  } catch (err) {
    console.log("Error update user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
