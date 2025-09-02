//authController.js
//
import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  try {
    const { firstName, lastName, password, loginId } = req.body;

    const existingUser = await User.findOne({ loginId });
    if (existingUser) {
      return res.status(400).json({ msg: "Email or Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({ firstName, lastName, loginId, password: hashPassword });
    await user.save();

    // Generate JWT for new user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" });

    res.status(201).json({
      token,
      user: { id: user._id, loginId: user.loginId, firstName: user.firstName, lastName: user.lastName },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({ loginId });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" });

    res.json({
      token,
      user: { _id: user._id, loginId: user.loginId },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};