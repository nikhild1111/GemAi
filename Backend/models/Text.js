import mongoose from "mongoose";

const textSchema = new mongoose.Schema({
  imageName: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  formattedMCQ: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

const Text = mongoose.model("Text", textSchema);

export default Text;