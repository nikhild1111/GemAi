import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Fixed typo: 'require' → 'required'
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
    enum: ["Admin", "User", "Primium"],
    default: "User"
  },
  phone: {
    type: Number,
    required: true,
    default:'8328879891'
  },
  topics: {
    type: Object,
    default: {},
  }
  
});

const User = mongoose.model("User", userSchema);
export default User;
