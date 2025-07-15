import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();
router.use(authMiddleware, roleMiddleware(["teacher", "administrator"]));

export default router;
