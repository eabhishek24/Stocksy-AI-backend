const User = require("../models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect password or email" });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: "Incorrect password or email" });
    }

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
    httpOnly: true,
    secure: false,          // ❌ change this for localhost (only use true in prod)
    sameSite: "Lax",        // ✅ Lax works fine across localhost ports
    path: "/",              // ✅ ensures it’s valid for all routes
});


    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      //token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
