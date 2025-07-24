import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "User", "Premium"],
    default: "User"
  },
  phone: {
    type: Number,
    required: true,
    default: '8328879891'
  },
  topics: {
    type: Object,
    default: {},
  },
  notes: [{
    question: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      required: true
    },
    originalQuestion: {
      type: String,
      required: true
    },
    originalAnswer: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

const User = mongoose.model("User", userSchema);
export default User;