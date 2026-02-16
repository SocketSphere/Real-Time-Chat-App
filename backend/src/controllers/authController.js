//authController.js
//
import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendWelcomeEmail } from "../utils/sendWebhook.js";
import crypto from "crypto";


export const register = async (req, res) => {
  try {
    const { firstName, lastName, password, loginId } = req.body;

    const existingUser = await User.findOne({ loginId });
    if (existingUser) {
      return res.status(400).json({ msg: "Email or Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = new User({
      firstName,
      lastName,
      loginId,
      password: hashPassword,
      verificationToken
    });
    await user.save();

    await sendWelcomeEmail(
      `${firstName} ${lastName}`,
      loginId,
      verificationToken

    );

    // Generate JWT for new user
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" });

    // res.status(201).json({
    //   token,
    //   user: { id: user._id, loginId: user.loginId , profileImage: user.profileImage || null, firstName: user.firstName, lastName: user.lastName },
    // });
    res.status(201).json({
      message: "Account created. Please verify your email before logging in."
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    const user = await User.findOne({ loginId });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(401).json({ msg: "Please verify your email first" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" });

    res.json({
      token,
      user: {
        _id: user._id,
        loginId: user.loginId,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage || null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.send("Invalid verification link");
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.send("Invalid or expired link");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    // Remove trailing slash from FRONTEND_URL if it exists
    const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
    res.redirect(`${frontendUrl}/auth-success?token=${jwtToken}`);

  } catch (err) {
    res.status(500).send("Verification failed");
  }
};


