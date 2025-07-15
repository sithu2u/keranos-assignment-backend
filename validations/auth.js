import Joi from "joi";

// Define create user the validation schema
const createUserSchema = Joi.object({
  name: Joi.string().required().min(3).max(255),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
});

// Define login user the validation schema
const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
});

// Define forgot Password user the validation schema
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Define update user the validation schema
const updateUserSchema = Joi.object({
  name: Joi.string().allow("").optional().min(3).max(255),
  email: Joi.string().email().allow("").optional(),
  password: Joi.string().allow("").optional().min(6),
  role: Joi.string().valid("administrator", "teacher", "student").required(),
});

export {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
  forgotPasswordSchema,
};
