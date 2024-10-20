import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token =
      req.headers["x-access-token"] ||
      req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.accountAddress = decoded.accountAddress;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Access denied. Invalid token.",
    });
  }
};

export { auth };
