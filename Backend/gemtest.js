import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
// or "gemini-2.0-pro" if you need deeper reasoning

const result = await model.generateContent("Write 5 MCQs about JavaScript basics");
console.log(result.response.text());