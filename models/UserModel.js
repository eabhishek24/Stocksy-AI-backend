const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const userSchema = new mongoose.Schema({

    email:{
        type: String,
        required: [true, "Your email address is requried"],
        unique: true,
    },

    username:{
        type: String,
        required: [true, "Your username is requried"],
    },

    password:{
        type: String,
        required: [true, "Your password is requried"],
    },

    createdAt:{
        type: Date,
        default: new Date(),
    },
});

userSchema.pre("save",async function(){
    this.password = await bcrypt.hash(this.password,12) 
});

module.exports = mongoose.model("User",userSchema);