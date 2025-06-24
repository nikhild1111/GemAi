import { GoogleGenerativeAI } from '@google/generative-ai';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const generateQuestionsFromResume = async (resumeText) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  const prompt = `Generate interview questions from this resume:\n${resumeText}`;

  let retries = 3;

  while (retries > 0) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const questions = text.split('\n').filter(q => q.trim());
      return questions;
    } catch (error) {
      if (error.status === 429) {
        console.warn("Rate limit hit. Retrying...");
        await sleep(15000); // wait 15 seconds
        retries--;
      } else {
        throw error;
      }
    }
  }

  throw new Error("Rate limit exceeded. Please try again later.");
};
