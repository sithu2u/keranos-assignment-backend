import userService from "../providers/users/user.service.js";

export const roleMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const user = await userService.getUserByID(req.user._id);
      if (!user || !allowedRoles.includes(user.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: insufficient role" });
      }

      next();
    } catch (err) {
      console.log("middleware", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
