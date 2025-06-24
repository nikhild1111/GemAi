import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import User from "../models/UserData.js";

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate request
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details carefully",
      });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email does not exist. Please sign up first.",
      });
    }

    // 3. Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(403).json({
        success: false,
        message: "Invalid password",
      });
    }

    
    // 4. Create JWT token
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "LASTCHANSE", // fallback if env var is missing
      { expiresIn: "2h" }
    );

    // 5. Set token in cookie
    const tokenExpiryDuration = 2 * 60 * 60 * 1000; // JWT expires in 2 hours

    const options = {
      // expires: new Date(Date.now() + tokenExpiryDuration),
      maxAge: 24 * 60 * 60 * 1000, // 1 day
     httpOnly: true,
      sameSite: 'Lax'
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
        secure: process.env.NODE_ENV === 'production',
      message: "User login successful",
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};
