const jwt = require("jsonwebtoken");
const User = require("../models/UserModel"); 

module.exports.verifyUser = async (req, res) => {
  try {

    const token = req.cookies.token; // read from cookie

    if (!token) {
      return res.json({ status: false });
    }

    // Verify the JWT using the same secret key
    jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
      if (err) {
        return res.json({ status: false });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.json({ status: false });
      }

      // Return only safe data
      return res.json({
        status: true,
        user: user.username,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
