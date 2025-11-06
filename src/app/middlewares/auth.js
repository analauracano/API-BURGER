import jwt from "jsonwebtoken";
import authConfig from "../../config/auth.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, authConfig.secret);

    req.userId = decoded.id;
    req.userName = decoded.name;
    req.userIsAdmin = decoded.admin;

    return next();
  } catch {
    return res.status(401).json({ error: "Token is invalid" });
  }
};

export default authMiddleware;
