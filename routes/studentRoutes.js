import express from "express";
import {
  createStudentProfile,
  getAllStudents,
  getStudentByUserId,
  updateStudentProfile,
} from "../controllers/studentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();
router.use(authMiddleware, roleMiddleware(["administrator"]));

router.post("/", createStudentProfile);
router.get("/", getAllStudents);
router.get("/:id", getStudentByUserId);
router.put("/:id", updateStudentProfile);

export default router;
