import jwt from "jsonwebtoken"

const auth = async (req, res, next) => {
  try {
      const token =
        req.headers["x-access-token"] ||
        req.headers["authorization"]?.split(" ")[1];
    console.log("token in auth", token);

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Access denied. No token provided.",
      });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("decoded", decoded);

    req.accountAddress = decoded.accountAddress;
    next();
  } catch (error) {
    return res.status(401).json({
        status: false,
        message: "Access denied. Invalid token.",
    })
  }
};

export {auth}