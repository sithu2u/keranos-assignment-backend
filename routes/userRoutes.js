import express from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  softDeleteUser,
  softDeleteUsers,
  restoreUser,
  deleteUser,
  testImagePreProcessing,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();
router.use(authMiddleware, roleMiddleware(["administrator"]));

router.get("/test", testImagePreProcessing);

router.put("/delete/:id", softDeleteUser);
router.put("/delete-many", softDeleteUsers);
router.put("/restore/:id", restoreUser);

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
