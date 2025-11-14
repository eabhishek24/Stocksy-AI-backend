const jwt = require("jsonwebtoken");

const requireAuth = async (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      req.userId = decoded.id;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };

module.exports = requireAuth;