import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import express from "express";
import cors from 'cors';
import { dbConnect } from "./Config/database.js";
import cookieParser from "cookie-parser";
import Links from "./Routes/Linksuser.js";
import history from "./Routes/history.js";
import verifyToken from "./middlewares/verifyToken.js";  // Don't forget to import this
import User from "./models/UserData.js"; // Needed for saveTopic route

const app = express();
dotenv.config();

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
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // React frontend
  credentials: true               // 👈 allow sending cookies
}));

// app.use(cors({ credentials: true, origin: "http://localhost:5173" })); // Update origin as needed
app.use(cookieParser());

//  DB Connect
dbConnect();

// Main route
app.use("/api/v1", Links, history);

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
Give me a well-structured explanation on the topic: "${question}".

Your response should be in this format:

1. First, provide a short and clear **definition** of the topic in 1-2 lines.

2. Then list **five major headings** (main concepts or aspects of the topic), each starting with numbering like 1, 2, 3...

3. Under each heading, give **2-3 key points**. Each key point should start with a "-" symbol like this at it only one symbol:

4.dont give the starts plaese .

Example Output:
Definition: [Your definition here]

1. Heading 1
> Subpoint A  
> Subpoint B  

2. Heading 2  
> Subpoint A  
> Subpoint B  
> Subpoint C  

Make the explanation simple, clear, and suitable for college-level students.
`;
  try {
    const result = await generate(prompt);
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
