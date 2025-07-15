import Joi from "joi";
import { isValidObjectId } from "mongoose";

const customObjectId = Joi.string().custom((value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

// Define create user the validation schema
export const createStudentProfileSchema = Joi.object({
  userId: customObjectId.required(),
  studentId: Joi.string().required().min(3).max(255),
  className: Joi.string().allow("").optional(),
  section: Joi.string().allow("").optional(),
});

// Define update user the validation schema
export const updateStudentProfileSchema = Joi.object({
  studentId: Joi.string().optional().min(3).max(255),
  className: Joi.string().allow("").optional(),
  section: Joi.string().allow("").optional(),
});
