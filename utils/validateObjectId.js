import mongoose from "mongoose";

export const validateObjectId = (id) => {
  if (!id || !mongoose.isValidObjectId(id)) return false;
  return true;
};
