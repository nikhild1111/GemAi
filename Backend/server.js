import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import express from "express";
import cors from 'cors';
import authRoutes from "./Routes/auth.js";
import { dbConnect } from "./Config/database.js";
import cookieParser from "cookie-parser";
import Links from "./Routes/Linksuser.js";
import history from "./Routes/history.js";
import verifyToken from "./middlewares/verifyToken.js";  // Don't forget to import this
import User from "./models/UserData.js"; // Needed for saveTopic route
import Extracttext from './Routes/Extracttext.js'
const app = express();
dotenv.config();
// ✅ Add this line to parse JSON bodies
app.use(express.json());
//  Use env var instead of hardcoding API key (secure)
// const gemini_api_key = "AIzaSyAutDY9WF-UqQ3m99DTmQGKtPvXIT-_9hg";
const gemini_api_key = process.env.GEMINI_API_KEY;

const googleAI = new GoogleGenerativeAI(gemini_api_key);

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const port = process.env.PORT || 3000;

//  Middlewares
app.use(bodyParser.json());
// Replace this with your actual frontend URL
const allowedOrigins = [
  "https://gemai-1.onrender.com",  // Your deployed frontend
  "http://localhost:5173"          // For local testing
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
// app.use(cors({ credentials: true, origin: "http://localhost:5173" })); // Update origin as needed
app.use(cookieParser());

//  DB Connect
dbConnect();

// Main route
app.use("/api/v1", Links, history);
app.use("/api", authRoutes);
import ResumeRoute from './Routes/ResumeRoute.js';
app.use('/api/resume', ResumeRoute);
app.use('/extract',Extracttext);

import notesRoutes from './Routes/notesRoutes.js';

// Add this route after your existing routes
app.use('/api/notes', notesRoutes);
//  What happens when you call POST /api/content?
// Express checks: does this match /api?
// Yes — because /api/content starts with /api.

// So it checks inside authRoutes if there's a route like /content.
//  If not found in authRoutes, it moves on.

// Next, Express checks: is there a direct match with app.post("/api/content")?
//  Yes — so it runs that route handler.

app.get("/", (req, res) => {
  res.status(200).json({
    message: "✅ API is running successfully!",
    status: "OK"
  });
});




// Generate content function
const generate = async (question) => {
  try {
    const result = await geminiModel.generateContent(question);
    const response = result.response;
    return response.text();  // Proper use of .text()`
  } catch (error) {
    console.error("response error", error);
    return "Failed to generate response";
  }
};

app.post('/api/content', async (req, res) => {
  let { question } = req.body;

 const prompt = `
You are an intelligent AI teacher.

Based on the following question: "${question}", do the following:

1. Generate a clean and short **title** for this topic (max 4-6 words), suitable to be stored as a key in a database. Make it simple, clear, and relevant. Write it on a single line like:  
**Title:** Your Title Here

2. Then give a clear **definition** of the topic in 1-2 lines.

3. Then list **five major headings** (main concepts or aspects of the topic), each starting with numbering like 1, 2, 3...

4. Under each heading, give **2-3 key points**. Each key point should start with a single "-" symbol. Do NOT use "*", or bullet emojis.

Important Notes:
- Do NOT start with "Sure", "Here's", or any extra text.
- Do NOT include markdown symbols like "**", "*", or "->"
- Keep the language simple, clean, and easy to read for college-level students.

Expected Output Format:
Title: [Simple Title Here]

Definition: [Your definition here]

1. Heading 1  
- Subpoint A  
- Subpoint B  
- Subpoint C
- Subpoint d

2. Heading 2  
- Subpoint A  
- Subpoint B  
- Subpoint C

(Continue up to 5 headings)
`;
  try {
    const result = await generate(prompt);
    console.log(result);
    res.json({
      success: true,
      result: result,
      message: "Welcome to the Protect  route ",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Fat Gya Code",
    });
  }
});


// ✅ Save topic route with user authentication (using PATCH)
app.patch("/api/saveTopic", verifyToken, async (req, res) => {
  const { topic, cards } = req.body;
  const userId = req.user.id; // ⬅️ ID from JWT token

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Merge or update the topic
    user.topics = {
      ...user.topics,
      [topic]: cards,
    };
    await user.save();

    res.status(200).json({ message: "✅ Flashcards saved!" });
  } catch (err) {
    console.error("Error saving topic:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// ✅ Get all saved topics for the logged-in user
app.get("/api/getTopics", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ topics: user.topics });
  } catch (err) {
    console.error("Error fetching topics:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /api/deleteTopic/:topic - Delete a topic permanently
app.delete('/api/deleteTopic/:topic', verifyToken, async (req, res) => {
  const topic = decodeURIComponent(req.params.topic);
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.topics.hasOwnProperty(topic)) {
      delete user.topics[topic];
      user.markModified('topics'); // Important to persist nested changes
      await user.save();
      return res.status(200).json({ success: true, message: 'Topic deleted successfully' });
    } else {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }
  } catch (err) {
    console.error('Error deleting topic:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




// Inside your backend server file
app.post("/api/quiz", async (req, res) => {
  const { topic, definition } = req.body;

  const quizPrompt = `
Create 5 multiple choice questions based on the topic: "${topic}"
Definition: "${definition}"

Each question should have:
1. A clear and concise question.
2. Four options (A, B, C, D).
3. The correct answer labeled clearly.

Format:
Q1: Question text?
A. Option 1  
B. Option 2  
C. Option 3  
D. Option 4  
Answer: B  

Repeat this format for all 5 questions.
Make it simple and useful for college-level students.
`;

  try {
    const result = await generate(quizPrompt);
    res.status(200).json({ quiz: result });
  } catch (err) {
    console.error("Error generating quiz:", err);
    res.status(500).json({ message: "Failed to generate quiz" });
  }
});

// ✅ Server listening
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
