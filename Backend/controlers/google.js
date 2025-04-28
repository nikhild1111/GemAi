import jwt from "jsonwebtoken";
import User from "../models/UserData.js";
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);  // put your google client id in .env

export const googleLoginController = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // If user does not exist, optionally create it (Optional)
      user = await User.create({ name,email, password: 'GOOGLE_USER' });
    }

    const jwtToken = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET || "LASTCHANSE",
      { expiresIn: "2h" }
    );

    res.cookie("token", jwtToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
       .status(200)
       .json({ success: true, token: jwtToken, message: "Google Login successful" });

  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({ success: false, message: "Google login failed" });
  }
};
