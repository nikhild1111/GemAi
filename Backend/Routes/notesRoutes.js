// Routes/notesRoutes.js
import express from 'express';
import { 
  createNote, 
  getNotes, 
  getNoteById, 
  updateNote, 
  deleteNote,
  searchNotes 
} from '../controllers/notesController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// All routes are protected with authentication
router.post('/create', verifyToken, createNote);
router.get('/all', verifyToken, getNotes);
router.get('/search', verifyToken, searchNotes);
router.get('/:id', verifyToken, getNoteById);
router.put('/:id', verifyToken, updateNote);
router.delete('/:id', verifyToken, deleteNote);

export default router;