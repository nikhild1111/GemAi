// controllers/notesController.js
import User from "../models/UserData.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini_api_key = process.env.GEMINI_API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Generate formatted content using Gemini AI
const formatWithGemini = async (question, answer) => {
  const prompt = `
You are an intelligent content formatter. Your task is to improve the given question and answer while keeping the original meaning intact.

Original Question: "${question}"
Original Answer: "${answer}"

Please do the following:
1. Correct spelling and grammar errors
2. Improve sentence structure and clarity
3. Keep the content and meaning exactly the same
4. Make it more readable and professional
5. Don't add extra information, just format and correct what's given

Return the response in this exact format:
QUESTION: [Formatted question here]
ANSWER: [Formatted answer here]
`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse the response to extract question and answer
    const questionMatch = text.match(/QUESTION:\s*(.*?)(?=ANSWER:|$)/s);
    const answerMatch = text.match(/ANSWER:\s*(.*?)$/s);
    
    return {
      question: questionMatch ? questionMatch[1].trim() : question,
      answer: answerMatch ? answerMatch[1].trim() : answer
    };
  } catch (error) {
    console.error("Gemini formatting error:", error);
    // Return original content if formatting fails
    return { question, answer };
  }
};

// Create a new note
export const createNote = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const userId = req.user.id;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required"
      });
    }

    // Format content with Gemini AI
    const formatted = await formatWithGemini(question, answer);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const newNote = {
      question: formatted.question,
      answer: formatted.answer,
      originalQuestion: question,
      originalAnswer: answer,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    user.notes.push(newNote);
    await user.save();

    // Get the created note with its ID
    const createdNote = user.notes[user.notes.length - 1];

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note: createdNote
    });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get all notes for a user
export const getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Sort notes by creation date (newest first)
    const sortedNotes = user.notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotes = sortedNotes.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      notes: paginatedNotes,
      pagination: {
        currentPage: page,
        totalNotes: user.notes.length,
        totalPages: Math.ceil(user.notes.length / limit),
        hasNext: endIndex < user.notes.length,
        hasPrev: startIndex > 0
      }
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get a specific note by ID
export const getNoteById = async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const note = user.notes.id(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    res.status(200).json({
      success: true,
      note: note
    });
  } catch (error) {
    console.error("Get note by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Update a note
export const updateNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const note = user.notes.id(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    // Format content with Gemini AI
    const formatted = await formatWithGemini(question, answer);

    note.question = formatted.question;
    note.answer = formatted.answer;
    note.originalQuestion = question;
    note.originalAnswer = answer;
    note.updatedAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: note
    });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const noteIndex = user.notes.findIndex(note => note._id.toString() === noteId);
    if (noteIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    user.notes.splice(noteIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Note deleted successfully"
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Search notes
export const searchNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Search in both question and answer fields
    const searchResults = user.notes.filter(note => 
      note.question.toLowerCase().includes(query.toLowerCase()) ||
      note.answer.toLowerCase().includes(query.toLowerCase())
    );

    // Sort by relevance (question matches first, then answer matches)
    const sortedResults = searchResults.sort((a, b) => {
      const aQuestionMatch = a.question.toLowerCase().includes(query.toLowerCase());
      const bQuestionMatch = b.question.toLowerCase().includes(query.toLowerCase());
      
      if (aQuestionMatch && !bQuestionMatch) return -1;
      if (!aQuestionMatch && bQuestionMatch) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({
      success: true,
      notes: sortedResults,
      count: sortedResults.length
    });
  } catch (error) {
    console.error("Search notes error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};