import express from "express";
import Otp from "../models/Otp.js";
import sendOTP from "../utils/sendOTP.js";
import User from "../models/UserData.js";

const router = express.Router();


router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists Use Login or other Email ",
      });
    }


  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });
    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const record = await Otp.findOne({ email, otp });

  if (!record) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  await Otp.deleteOne({ _id: record._id });
  res.status(200).json({ message: "OTP verified" });
});

export default router;
