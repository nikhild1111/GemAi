# AI-Powered Resource Generator

An intelligent study companion that leverages Google's Gemini 1.5 AI model to automatically generate personalized flashcards and quizzes from any topic. Built to help students learn more efficiently through AI-generated content and interactive assessments.

## 🌟 Features

- **AI-Powered Flashcard Generation** - Enter any topic and get instant flashcards with key concepts
- **Smart Quiz System** - Time-based quizzes with four options per question and instant evaluation
- **Topic Management** - Save and organize your generated topics for quick access
- **Secure Authentication** - JWT-based login with OTP email verification
- **OAuth Integration** - Quick sign-in with Google using OAuth 2.0
- **Test Portal for Competitive Exams** - Upload question paper images, extract questions via OCR, and generate timed tests
- **Responsive Design** - Clean, user-friendly interface that works on all devices

## 🛠️ Tech Stack

**Frontend:**
- React.js
- CSS3 for styling
- Axios for API calls

**Backend:**
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)

**AI & Services:**
- Google Gemini 1.5 API
- OCR for question extraction
- Nodemailer for email services

**Security:**
- JWT (JSON Web Tokens)
- bcrypt for password encryption
- OTP verification via email
- OAuth 2.0 for Google login

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed locally or MongoDB Atlas account
- Google Gemini API key
- Gmail account for Nodemailer

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/nikhild1111/GemAi.git
cd GemAi
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

Create a `.env` file in the `backend` directory with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
FRONTEND_URL=http://localhost:3000
```

5. **Run the application**

```bash
# Terminal 1 - Run backend (from backend folder)
cd backend
npm start

# Terminal 2 - Run frontend (from frontend folder)
cd frontend
npm start
```

The application will open at `http://localhost:3000`

## 🌐 Live Demo

**Live URL:** [https://gemai-1.onrender.com](https://gemai-1.onrender.com)

## 📋 Project Structure

```
ai-resource-generator/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   └── server.js
└── README.md
```

## 🔐 Security Features

- **Password Encryption** - bcrypt hashing for secure password storage
- **JWT Authentication** - Token-based authentication for protected routes
- **OTP Verification** - Email-based OTP using Nodemailer for signup verification
- **OAuth 2.0** - Google login integration for secure authentication
- **Environment Variables** - Sensitive data stored securely in .env files

## 📱 Application Flow

1. **Authentication** - Users can sign up with email/password (OTP verification) or use Google OAuth
2. **Ask Page** - Enter any topic to generate AI-powered flashcards instantly
3. **Save Topics** - Generated topics are saved to user's account for future access
4. **Quiz Feature** - Click "Quiz Me" to generate a timed multiple-choice quiz
5. **Test Portal** - Upload question paper images, extract questions via OCR, generate timed tests
6. **Results** - View quiz scores and final results after completion

## 🎯 Use Cases

- Students preparing for competitive exams
- Quick revision using AI-generated flashcards
- Self-assessment through timed quizzes
- Topic-wise learning and organization
- Question paper digitization and practice

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ to make learning smarter and more efficient

## 🙏 Acknowledgments

- Google Gemini API for AI-powered content generation
- MongoDB for database management
- React community for excellent documentation

---

**Note:** Make sure to replace placeholder values in the `.env` file with your actual credentials before running the application.
