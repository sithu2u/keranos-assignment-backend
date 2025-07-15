import express from "express";

import {
  uploadStudentAnswer,
  ocrStudentAnswer,
  findAllStudentAnswers,
  viewOcrResult,
} from "../controllers/studentAnswerController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { uploadMultiple } from "../middlewares/multer.js";

const router = express.Router();
router.use(authMiddleware, roleMiddleware(["teacher", "administrator"]));

// router.put("/:id/regions", updateRegion);

// router.put("/:id/info", updateExamTemplateInfo);

// router.get("/", findAllExamTemplates);
// router.get("/:id", findOneExamTemplate);

router.post("/:id/student-answers/ocr", ocrStudentAnswer);

router.get("/:id/student-answers", findAllStudentAnswers);
router.post("/:id/student-answers", uploadMultiple, uploadStudentAnswer);

router.get("/:id/student-answers/:answerId", viewOcrResult);

export default router;
