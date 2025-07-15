import Joi from "joi";

// Define create user the validation schema
const createUserSchema = Joi.object({
  name: Joi.string().required().min(3).max(255),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  role: Joi.string().valid("administrator", "teacher", "student").required(),
  status: Joi.string().valid("active", "inactive").required(),
});

// Define update user the validation schema
const updateUserSchema = Joi.object({
  name: Joi.string().optional().min(3).max(255),
  email: Joi.string().email().optional(),
  password: Joi.string().optional().min(6),
  role: Joi.string().valid("administrator", "teacher", "student").optional(),
  status: Joi.string().valid("active", "inactive").optional(),
});

export { createUserSchema, updateUserSchema };
