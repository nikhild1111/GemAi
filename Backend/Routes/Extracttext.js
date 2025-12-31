// import express from "express";
// import multer from "multer";
// import Tesseract from "tesseract.js";
// import fs from "fs";
// const router = express.Router();

// import path from "path";
// import Text from "../models/Text.js";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const geminiModel= genAI.getGenerativeModel({ model: "gemini-2.0-flash" });



// // Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ 
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
// });

// // Generate formatted MCQ using Gemini
// const formatMCQWithGemini = async (extractedText) => {
//   const prompt = `
// You are an AI that formats MCQ questions from extracted text.

// Here is the extracted text from an image:
// """
// ${extractedText}
// """

// Your task:
// 1. Identify all MCQ questions from the text
// 2. Format each question properly with:
//    - Question number and text
//    - Options labeled as A, B, C, D (one per line)
//    - DO NOT include the answer in the options section

// 3. After ALL questions are listed, create an "Answers" section at the end with format:
//    1. A
//    2. B
//    3. C
//    etc.

// Expected Output Format:
// 1. Question text here?
// A. Option 1
// B. Option 2
// C. Option 3
// D. Option 4

// 2. Question text here?
// A. Option 1
// B. Option 2
// C. Option 3
// D. Option 4

// (Continue for all questions...)

// Answers:
// 1. A
// 2. B
// 3. C
// 4. D
// (Continue for all questions...)

// Important Rules:
// - Keep the original question text as is
// - Clean up any OCR errors if obvious
// - Number questions sequentially (1, 2, 3...)
// - Label options exactly as A, B, C, D
// - Put ALL answers at the very end
// - If text is unclear or not an MCQ, return "ERROR: Unable to parse MCQ format"
// `;

//   try {
//     const result = await geminiModel.generateContent(prompt);
//     const response = result.response;
//     return response.text();
//   } catch (error) {
//     console.error("Gemini formatting error:", error);
//     throw new Error("Failed to format MCQ with Gemini: " + error.message);
//   }
// };

// // Single image upload endpoint (for sequential uploads from frontend)
// router.post("/upload", upload.single("image"), async (req, res) => {
//   try {
//     const imagePath = req.file.path;

//     console.log(`Processing image: ${req.file.filename}`);

//     // Step 1: OCR using Tesseract.js
//     const result = await Tesseract.recognize(imagePath, "eng", {
//       logger: (m) => console.log(m),
//     });
//     const extractedText = result.data.text;

//     console.log("Extracted text:", extractedText);

//     // Step 2: Format using Gemini AI
//     console.log("Formatting with Gemini AI...");
//     const formattedMCQ = await formatMCQWithGemini(extractedText);

//     console.log("Formatted MCQ:", formattedMCQ);

//     // Step 3: Save to database
//     const savedText = new Text({
//       imageName: req.file.filename,
//       extractedText: extractedText,
//       formattedMCQ: formattedMCQ
//     });
//     await savedText.save();

//     // Optional: Delete the image file after processing
//     // fs.unlinkSync(imagePath);

//     res.json({ 
//       text: extractedText,
//       formattedMCQ: formattedMCQ,
//       imageName: req.file.filename,
//       success: true 
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ 
//       error: "Failed to extract and format text",
//       details: err.message 
//     });
//   }
// });

// router.post("/upload-multiple", upload.array("images", 6), async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ error: "No images uploaded" });
//     }

//     console.log(`Processing ${req.files.length} images together...`);

//     let combinedExtractedText = "";
//     const individualResults = [];

//     // Step 1: Extract text from all images (OCR)
//     for (let i = 0; i < req.files.length; i++) {
//       const file = req.files[i];
//       const imagePath = file.path;

//       console.log(`Extracting text from Image ${i + 1}/${req.files.length}: ${file.filename}`);

//       const result = await Tesseract.recognize(imagePath, "eng", {
//         logger: (m) => console.log(m),
//       });

//       const extractedText = result.data.text.trim();

//       combinedExtractedText += `\n\n${extractedText}`;
//       individualResults.push({
//         imageName: file.filename,
//         extractedText: extractedText,
//       });

//       // Optional: delete image after processing
//       fs.unlinkSync(imagePath);
//     }

//     // Step 2: Send all combined text to Gemini once
//     console.log("Sending combined text to Gemini for MCQ formatting...");
//     const formattedMCQ = await formatMCQWithGemini(combinedExtractedText);

//     // Step 3: Save combined result in database
//     const savedText = new Text({
//       imageName: `combined_${Date.now()}`,
//       extractedText: combinedExtractedText,
//       formattedMCQ: formattedMCQ,
//     });
//     await savedText.save();

//     // Step 4: Send response
//     res.json({
//       success: true,
//       totalImages: req.files.length,
//       combinedExtractedText: combinedExtractedText.trim(),
//       formattedMCQ: formattedMCQ.trim(),
//       individualResults,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       error: "Failed to extract and format text from images",
//       details: err.message,
//     });
//   }
// });


// // Get all extracted texts
// router.get("/texts", async (req, res) => {
//   try {
//     const texts = await Text.find().sort({ createdAt: -1 });
//     res.json(texts);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch texts" });
//   }
// });

// export default router;


import express from "express";
import multer from "multer";
import Tesseract from "tesseract.js";
import fs from "fs";
const router = express.Router();
import path from "path";
import Text from "../models/Text.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
});

// Helper function to wait/sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate formatted MCQ using Gemini with retry logic
const formatMCQWithGemini = async (extractedText, retryCount = 0) => {
  const MAX_RETRIES = 3;
  const BASE_DELAY = 2000; // 2 seconds

//   const prompt = `
// You are an AI that formats MCQ questions from extracted text.

// Here is the extracted text from an image:
// """
// ${extractedText}
// """

// Your task:
// 1. Identify all MCQ questions from the text
// 2. Format each question properly with:
//    - Question number and text
//    - Options labeled as A, B, C, D (one per line)
//    - DO NOT include the answer in the options section
// 3. After ALL questions are listed, create an "Answers" section at the end with format:
//    1. A
//    2. B
//    3. C
//    etc.

// Expected Output Format:

// 1. Question text here?
// A. Option 1
// B. Option 2
// C. Option 3
// D. Option 4

// 2. Question text here?
// A. Option 1
// B. Option 2
// C. Option 3
// D. Option 4

// (Continue for all questions...)

// Answers:
// 1. A
// 2. B
// 3. C
// 4. D
// (Continue for all questions...)

// Important Rules:
// - Keep the original question text as is
// - Clean up any OCR errors if obvious
// - Number questions sequentially (1, 2, 3...)
// - Label options exactly as A, B, C, D
// - Put ALL answers at the very end
// - If text is unclear or not an MCQ, return "ERROR: Unable to parse MCQ format"
// `;
const prompt = `
You are an AI that extracts multiple-choice questions (MCQs) from text
and returns them in strict JSON format.

Extract MCQs from the text below and return an array of objects.

Each object must follow this EXACT structure:
{
  "id": number,
  "question": string,
  "options": {
    "A": string,
    "B": string,
    "C": string,
    "D": string
  },
  "correctAnswer": "A" | "B" | "C" | "D"
}

Rules:
- Keep the original question text
- Fix obvious OCR mistakes
- Each question MUST have exactly 4 options (A, B, C, D)
- Do NOT include explanations
- Do NOT include extra text
- Do NOT wrap output in markdown
- Return ONLY valid JSON
- If MCQs cannot be identified, return:
  { "error": "Unable to parse MCQ format" }

Text:
${extractedText}
`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini formatting error:", error);

    // Check if it's a quota/rate limit error (429)
    if (error.message && error.message.includes("429")) {
      // Extract retry delay from error message if available
      const retryMatch = error.message.match(/retry in (\d+\.?\d*)s/i);
      const retryDelay = retryMatch 
        ? parseFloat(retryMatch[1]) * 1000 
        : BASE_DELAY * Math.pow(2, retryCount); // Exponential backoff

      if (retryCount < MAX_RETRIES) {
        console.log(`Rate limit hit. Retrying after ${retryDelay / 1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await sleep(retryDelay);
        return formatMCQWithGemini(extractedText, retryCount + 1);
      } else {
        throw new Error(
          "QUOTA_EXCEEDED: You have exceeded your Gemini API quota. Please check your plan at https://ai.google.dev/pricing or wait for quota reset."
        );
      }
    }

    // For other errors, throw them
    throw new Error("Failed to format MCQ with Gemini: " + error.message);
  }
};

// Single image upload endpoint
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imagePath = req.file.path;
    console.log(`Processing image: ${req.file.filename}`);

    // Step 1: OCR using Tesseract.js
    const result = await Tesseract.recognize(imagePath, "eng", {
      logger: (m) => console.log(m),
    });
    const extractedText = result.data.text;
    console.log("Extracted text:", extractedText);

    // Step 2: Format using Gemini AI
    console.log("Formatting with Gemini AI...");
    const formattedMCQ = await formatMCQWithGemini(extractedText);
    console.log("Formatted MCQ:", formattedMCQ);

    // Step 3: Save to database
    const savedText = new Text({
      imageName: req.file.filename,
      extractedText: extractedText,
      formattedMCQ: formattedMCQ
    });
    await savedText.save();

    // Optional: Delete the image file after processing
    fs.unlinkSync(imagePath);

    res.json({
      text: extractedText,
      formattedMCQ: formattedMCQ,
      imageName: req.file.filename,
      success: true
    });
  } catch (err) {
    console.error(err);

    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Send appropriate error response based on error type
    if (err.message && err.message.includes("QUOTA_EXCEEDED")) {
      return res.status(429).json({
        error: "API quota exceeded",
        message: "You have exceeded your Gemini API quota. Please upgrade your plan or wait for quota reset.",
        details: err.message,
        success: false
      });
    }

    res.status(500).json({
      error: "Failed to extract and format text",
      details: err.message,
      success: false
    });
  }
});

router.post("/upload-multiple", upload.array("images", 6), async (req, res) => {
  const uploadedFiles = [];
  
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    console.log(`Processing ${req.files.length} images together...`);

    // Track uploaded files for cleanup
    uploadedFiles.push(...req.files.map(f => f.path));

    let combinedExtractedText = "";
    const individualResults = [];

    // Step 1: Extract text from all images (OCR)
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const imagePath = file.path;

      console.log(`Extracting text from Image ${i + 1}/${req.files.length}: ${file.filename}`);

      const result = await Tesseract.recognize(imagePath, "eng", {
        logger: (m) => console.log(m),
      });

      const extractedText = result.data.text.trim();
      combinedExtractedText += `\n\n${extractedText}`;

      individualResults.push({
        imageName: file.filename,
        extractedText: extractedText,
      });
    }

    // Step 2: Send all combined text to Gemini once
    console.log("Sending combined text to Gemini for MCQ formatting...");
    const formattedMCQ = await formatMCQWithGemini(combinedExtractedText);

    // Step 3: Save combined result in database
    const savedText = new Text({
      imageName: `combined_${Date.now()}`,
      extractedText: combinedExtractedText,
      formattedMCQ: formattedMCQ,
    });
    await savedText.save();

    // Step 4: Clean up uploaded files
    uploadedFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Step 5: Send response
    res.json({
      success: true,
      totalImages: req.files.length,
      combinedExtractedText: combinedExtractedText.trim(),
      formattedMCQ: formattedMCQ.trim(),
      individualResults,
    });
  } catch (err) {
    console.error(err);

    // Clean up all uploaded files on error
    uploadedFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.error(`Failed to delete file ${filePath}:`, unlinkErr);
        }
      }
    });

    // Send appropriate error response based on error type
    if (err.message && err.message.includes("QUOTA_EXCEEDED")) {
      return res.status(429).json({
        error: "API quota exceeded",
        message: "You have exceeded your Gemini API quota. Please upgrade your plan or wait for quota reset.",
        details: err.message,
        success: false
      });
    }

    res.status(500).json({
      error: "Failed to extract and format text from images",
      details: err.message,
      success: false
    });
  }
});

// Get all extracted texts
router.get("/texts", async (req, res) => {
  try {
    const texts = await Text.find().sort({ createdAt: -1 });
    res.json(texts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch texts" });
  }
});

export default router;