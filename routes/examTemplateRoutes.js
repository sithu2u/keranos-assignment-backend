import express from "express";

// import upload from "../middlewares/uploadMiddleware.js";
import {
  createExamTemplate,
  findAllExamTemplates,
  findOneExamTemplate,
  updateRegion,
  updateExamTemplateInfo,
} from "../controllers/examTemplateController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

import { uploadSingle } from "../middlewares/multer.js";

const router = express.Router();
router.use(authMiddleware, roleMiddleware(["teacher", "administrator"]));

router.put("/:id/regions", updateRegion);

router.put("/:id/info", updateExamTemplateInfo);

router.get("/", findAllExamTemplates);
router.get("/:id", findOneExamTemplate);

router.post("/", uploadSingle, createExamTemplate);

export default router;
