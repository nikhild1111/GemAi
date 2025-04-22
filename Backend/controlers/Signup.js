import bcrypt from "bcrypt";
import User from "../models/UserData.js";
import jwt from "jsonwebtoken";

export const Signup = async (req, res) => {
  try {
    const { name, email, password, role, phone} = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please use a different email.",
      });
    }

    // Hash the password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing the password. Server error.",
      });
    }

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      topics: {}, // default empty object
    });

 // Generate JWT token
 const payload = {
  email: user.email,
  id: user._id,
  role: user.role,
};


const token = jwt.sign(payload, process.env.JWT_SECRET || "LASTCHANSE", {
  expiresIn: "2h",
});

  // Set cookie options
  const options = {
    expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production", // true in production
  };




 
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      message: "User login successful",
    });


       // Set token in cookie
    //    res.cookie("token", token, options);
    // // Success response
    // return res.status(200).json({
    //   success: true,
    //   message: "Signup successful",
    //   user: {
    //     name: user.name,
    //     email: user.email,
    //     role: user.role,
    //     phone: user.phone,
    //   },
    // });
    // Success response
    // return res.status(200).json({
    //   success: true,
    //   message: "Signup successful",
    //   user: {
    //     name: user.name,
    //     email: user.email,
    //     role: user.role,
    //     phone: user.phone,
    //   },
    // });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Internal server error.",
    });
  }
};
