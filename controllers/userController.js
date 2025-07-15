import User from "../models/UserModel.js";
import { createUserSchema, updateUserSchema } from "../validations/user.js";
import userService from "../providers/users/user.service.js";
import { extractValidationErrors } from "../utils/extractValidationErrors.js";
import { validateRequest } from "../utils/validateRequest.js";
import { validateObjectId } from "../utils/validateObjectId.js";
// import { deskewImage } from "../utils/deskewImage.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUser = async (req, res) => {
  try {
    // Validate the request body with schema
    const { error, value } = validateRequest(createUserSchema, req.body);

    if (error) {
      const err = extractValidationErrors(error);
      return res.status(400).json({ errors: err });
    }
    const { name, email, password, role, status } = value;

    //check email exists
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser)
      return res
        .status(400)
        .json({ errors: [{ key: "email", message: "Email aleready exist" }] });

    const user = await userService.createUser({
      name,
      email,
      password,
      role,
      status,
    });

    res.status(201).json({
      message: "User information has been added",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.log("Error creating user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userService.findAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.log("Error all users:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  if (!validateObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid Request" });

  try {
    const user = await userService.getUserByID(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.log("Error specific user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  if (!validateObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid Request" });

  try {
    const { error, value } = validateRequest(updateUserSchema, req.body);

    if (error) {
      const err = extractValidationErrors(error);
      return res.status(400).json({ errors: err });
    }
    const { email } = value;

    if (email) {
      const existUser = await userService.checkSomeoneUseProvidedEmail(
        req.params.id,
        email
      );
      if (existUser)
        return res.status(400).json({
          errors: [{ key: "email", message: "Email aleready exist" }],
        });
    }

    const user = await userService.updateUser(req.params.id, value);

    res.json({
      message: "User information has been updated",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.log("Error update user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Soft delete a user
const softDeleteUser = async (req, res) => {
  if (!validateObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid Request" });

  try {
    const user = await userService.softDeleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User Successfully deleted" });
  } catch (err) {
    console.log("Error soft delete user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Soft delete a users
const softDeleteUsers = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ message: "Please provide an array of user IDs" });
  }

  try {
    const result = await userService.softDeleteUsers(ids);

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "No users found to delete" });
    }

    res.json({
      message: `${result.modifiedCount} user(s) have been deleted`,
      result,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting users", error });
  }
};

// Restore a soft deleted user
const restoreUser = async (req, res) => {
  if (!validateObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid Request" });

  try {
    const user = await userService.restoreUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User Successfully restored" });
  } catch (err) {
    console.log("Error restore user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Permanently delete a user
const deleteUser = async (req, res) => {
  if (!validateObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid Request" });

  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    console.log("Error delete user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const testImagePreProcessing = async (req, res) => {
  // const inputPath = "/app/uploads/question.jpg";
  // const outputPath = "/app/uploads/processed/question1.jpg";

  // deskewImage(inputPath, outputPath);

  // console.log("✅ Deskewed image saved to:", outputPath);
  return;
};

export {
  createUser,
  getUsers,
  getUser,
  updateUser,
  softDeleteUser,
  softDeleteUsers,
  restoreUser,
  deleteUser,
  testImagePreProcessing,
};
