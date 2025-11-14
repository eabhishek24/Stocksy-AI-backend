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
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production (HTTPS required)
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // None for cross-site in prod
            path: "/",       // ✅ available for all routes
        });


        res
        .status(201)
        .json({ message: "User signed in successfully", success: true });

        next();

    } catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};