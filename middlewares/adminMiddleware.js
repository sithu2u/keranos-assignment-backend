import userService from "../providers/users/user.service.js";
/**
 *
 * Update with caching using radis for performance
 *
 **/
export const adminMiddleware = async (req, res, next) => {
  try {
    const userData = await userService.getUserByID(req.user._id);
    if (userData.role !== "administrator") {
      return res.status(403).json({ message: "Access Denied" });
    }
  } catch (err) {
    console.log("middleware", err);
    res.status(500).json({ message: "Internal Server Error" });
  }

  next();
};
