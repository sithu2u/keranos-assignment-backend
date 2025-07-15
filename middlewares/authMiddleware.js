import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
  // const publicPaths = [
  //   "/api/auth/login",
  //   "/api/auth/signup",
  //   "/api/auth/forgot-password",
  // ];
  // if (publicPaths.includes(req.path)) {
  //   return next(); // Skip auth
  // }

  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Access Denied" });
  }

  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
