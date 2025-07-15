import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUserSchema,
  loginUserSchema,
  forgotPasswordSchema,
} from "../validations/auth.js";
import userService from "../providers/users/user.service.js";
import { extractValidationErrors } from "../utils/extractValidationErrors.js";
import { validateRequest } from "../utils/validateRequest.js";

const signUpUser = async (req, res) => {
  try {
    // validate the request body with schema
    const { error, value } = validateRequest(createUserSchema, req.body);
    if (error) {
      const err = extractValidationErrors(error);
      return res.status(400).json({ errors: err });
    }

    const { name, email, password } = value;

    //check email exists
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "Email aleready exist" });

    const user = await userService.createUser({ name, email, password });

    res.status(201).json({
      message: "User Save",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error("Error Signup:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    // validate the request body with schema
    const { error, value } = validateRequest(loginUserSchema, req.body);

    if (error) {
      const err = extractValidationErrors(error);
      return res.status(400).json({ errors: err });
    }
    const { email, password } = value;

    //check email exists
    const user = await userService.getUserByEmailWithPassword(email);
    if (!user) return res.status(400).json({ message: "Email not found" });

    if (user.status === false)
      return res.status(400).json({ message: "Your account is inactive" });

    //compare hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    //generate token
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;
    const token = jwt.sign({ _id: user._id, name: user.name }, JWT_SECRET_KEY, {
      expiresIn: TOKEN_EXPIRY,
    });
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error Login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    // validate the request body with schema
    const { error, value } = validateRequest(forgotPasswordSchema, req.body);

    if (error) {
      const err = extractValidationErrors(error);
      return res.status(400).json({ errors: err });
    }
    const { email } = value;

    //check email exists
    const user = await userService.getUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Email not found" });

    //Todo
    //send email function
    //generate code
    //send email to user

    res.json({ message: "Reset email send. Implementing required" });
  } catch (err) {
    console.error("Error Forgot Password:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { signUpUser, loginUser, forgotPassword };
