const User = require("../models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req,res,next) => {

    try{

        const { email , password , username , createdAt} = req.body; // extract from the webpage
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.json({ message: "User already exists" });
        }

        const user = await User.create({ email, password, username, createdAt });
        const token = createSecretToken(user._id);

        res.cookie("token", token, {
        httpOnly: true,   // ✅ secure cookie (JS can't read it)
        secure: false,    // ❌ false for localhost, ✅ true for production (HTTPS)
        sameSite: "Lax",  // ✅ allows cross-port access for localhost
        path: "/",        // ✅ available for all routes
        });


        res
        .status(201)
        .json({ message: "User signed in successfully", success: true });

        next();

    } catch(error) {
        console.error(error);
    }
};