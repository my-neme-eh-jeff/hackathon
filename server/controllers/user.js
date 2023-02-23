const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
const SecretKey = process.env.SECRET_KEY
const User=require('../models/user')
const Feedback=require('../models/feedback')

const newUser = async (req, res) => {
    try {
        const { username, password} = req.body;
        if (!username || !password)
            return res
                .status(400)
                .json({ message: "Please fill the necessary details " });
        const user = new User(req.body);

        await user.save();
        const token = jwt.sign({ username: req.body.username }, SecretKey);
        res.cookie("jsonwebtoken", token, {
            maxAge: 604800000,
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        res.status(200).json({
            message: "Successfully Registered",
            user,
            token,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

       
        if (!username || !password)
            return res
                .status(400)
                .json({ message: "Please fill the necessary details " });

        const userData = await User.findOne({ username: req.body.username });

        if (!userData)
            return res.status(400).json({ message: "User not found" });
        const validPassword = await bcrypt.compare(
            req.body.password,
            userData.password
        );
        if (!userData || !validPassword)
            res.status(400).json({ message: "Invalid credentials" });
        else {
            const token = jwt.sign({ username: req.body.username }, SecretKey);
            res.cookie("jsonwebtoken", token, {

                maxAge: 604800000,

                httpOnly: true,
                sameSite: "none",
                secure: true,
            });

            return res.status(200).json({ userData, token });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    res.clearCookie("jsonwebtoken", { path: "/" });
    res.status(200).json({ message: "User logged out successfully" });
};

const feedback=async(req,res)=>{
    try {
        const {subject,message}=req.body
        const fdbk={
            subject:subject,
            message:message,
            user:req.user._id
        }
        var feedbk=await Feedback.create(fdbk)
        feedbk=await feedbk.populate("user","-password")
        res.status(200).json({message:feedbk})
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    newUser,
    loginUser,
    logout,
    feedback
};