import express from "express";
import {
  signUpUser,
  loginUser,
  forgotPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/signup", signUpUser);

export default router;
