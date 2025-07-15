import User from "../../models/UserModel.js";

const selectQueryOptions = "-password -__v";

const createUser = async ({
  name,
  email,
  password,
  role = "student",
  status = "inactive",
}) => {
  const user = new User({ name, email, password, role, status });
  return await user.save();
};

const getUserByID = async (id) => {
  return await User.findById(id).select(selectQueryOptions);
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email: new RegExp(`^${email}$`, "i") }).select(
    selectQueryOptions
  );
};

const getUserByEmailWithPassword = async (email) => {
  return await User.findOne({ email: new RegExp(`^${email}$`, "i") });
};

const findAllUsers = async () => {
  return await User.find({ deleted: false })
    .select(selectQueryOptions)
    .sort("name");
};

const checkSomeoneUseProvidedEmail = async (id, email) => {
  return await User.findOne({
    _id: { $ne: id },
    email,
  });
};

const updateUser = async (id, updates) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  Object.keys(updates).forEach((key) => {
    user[key] = updates[key];
  });

  await user.save();
  return user;
};

const softDeleteUser = async (id) => {
  return await User.findByIdAndUpdate(id, { deleted: true }, { new: true });
};

const softDeleteUsers = async (ids) => {
  return await User.updateMany(
    { _id: { $in: ids } },
    { $set: { deleted: true } }
  );
};

const restoreUser = async (id) => {
  return await User.findByIdAndUpdate(id, { deleted: false }, { new: true });
};

const deleteUser = async (id) => {
  return await User.findOneAndDelete({
    _id: id,
    deleted: true,
  });
};

export default {
  createUser,
  getUserByID,
  getUserByEmail,
  getUserByEmailWithPassword,
  findAllUsers,
  checkSomeoneUseProvidedEmail,
  updateUser,
  softDeleteUser,
  softDeleteUsers,
  restoreUser,
  deleteUser,
};
