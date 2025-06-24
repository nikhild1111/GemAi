import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // expires in 5 minutes
  },
});

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
