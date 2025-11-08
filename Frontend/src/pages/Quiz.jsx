


// import { useLocation, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";

// const Quiz = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { topic, quizData } = location.state;

//   const [questions, setQuestions] = useState([]);
//   const [currentQ, setCurrentQ] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [showScore, setShowScore] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

//   // Parse quizData into usable question objects
//   useEffect(() => {
//     const parseQuizData = () => {
//       const blocks = quizData
//         .split(/Q\d+:/)
//         .map((b) => b.trim())
//         .filter(Boolean);

//       const parsed = blocks.map((block) => {
//         const [mainPart, answerLine] = block.split(/Answer:\s*/i);
//         const questionMatch = mainPart.match(/^(.*?)\s*A\./s);
//         const question = questionMatch ? questionMatch[1].trim() : "";

//         const optionsMatch = [...mainPart.matchAll(/([A-D])\.\s(.*?)(?=(?:\n[A-D]\.|$))/gs)];
//         const options = optionsMatch.map(([, , option]) => option.trim());

//         const answerLetter = answerLine?.trim()?.[0];
//         const correctIndex = "ABCD".indexOf(answerLetter);
//         const answer = options[correctIndex];

//         return {
//           question,
//           options,
//           answer,
//         };
//       });

//       setQuestions(parsed);
//     };

//     parseQuizData();
//   }, [quizData]);

//   // Timer countdown logic
//   useEffect(() => {
//     if (showScore) return;

//     if (timeLeft === 0) {
//       setShowScore(true);
//       return;
//     }

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, showScore]);

//   const formatTime = (seconds) => {
//     const min = Math.floor(seconds / 60);
//     const sec = seconds % 60;
//     return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
//   };

//   const handleOptionClick = (option) => {
//     setSelectedOptions((prev) => ({
//       ...prev,
//       [currentQ]: option,
//     }));
//   };

//   const handleNext = () => {
//     if (currentQ < questions.length - 1) {
//       setCurrentQ(currentQ + 1);
//     } else {
//       setShowScore(true);
//     }
//   };

//   const handlePrev = () => {
//     if (currentQ > 0) {
//       setCurrentQ(currentQ - 1);
//     }
//   };

//   const calculateScore = () => {
//     return questions.reduce((score, q, idx) => {
//       return selectedOptions[idx] === q.answer ? score + 1 : score;
//     }, 0);
//   };

//   const handleAsk = () => navigate("/ask");
//   const handleSaved = () => navigate("/saved");

//   const handleRetake = () => {
//     setCurrentQ(0);
//     setSelectedOptions({});
//     setShowScore(false);
//     setTimeLeft(600); // Reset timer
//   };

//   if (questions.length === 0) {
//     return <p className="p-4 text-red-500">⚠️ Invalid or empty quiz data.</p>;
//   }

//   const currentQuestion = questions[currentQ];
//   const selected = selectedOptions[currentQ];

//   return (
//     <div className="p-4 sm:p-6 max-w-3xl mx-auto text-white">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-blue-400">Quiz on:</h2>
//           <h2 className="text-2xl font-bold text-black">{topic}</h2>
//         </div>
//         <div className="text-right">
//           <p className="text-lg font-semibold text-yellow-300">
//             ⏳ Time Left: {formatTime(timeLeft)}
//           </p>
//         </div>
//       </div>

//       {!showScore ? (
//         <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
//           <p className="text-lg font-semibold mb-4">
//             Q{currentQ + 1}: {currentQuestion.question}
//           </p>

//           <div className="space-y-3 mb-6">
//             {currentQuestion.options.map((option, idx) => {
//               const isCorrect = option === currentQuestion.answer;
//               const isSelected = option === selected;
//               let bg = "bg-gray-700 hover:bg-gray-600";

//               if (selected) {
//                 if (isCorrect) bg = "bg-green-600 text-white";
//                 else if (isSelected) bg = "bg-red-600 text-white";
//               }

//               return (
//                 <button
//                   key={idx}
//                   onClick={() => handleOptionClick(option)}
//                   className={`block w-full text-left px-4 py-2 rounded transition duration-200 ease-in-out ${bg}`}
//                 >
//                   {option}
//                 </button>
//               );
//             })}
//           </div>

//           <div className="flex flex-col sm:flex-row justify-between gap-3">
//             <button
//               onClick={handlePrev}
//               className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white disabled:opacity-50"
//               disabled={currentQ === 0}
//             >
//               Previous
//             </button>

//             <button
//               onClick={handleNext}
//               className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white"
//             >
//               {currentQ === questions.length - 1 ? "Show Score" : "Next"}
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center space-y-6 bg-gray-900 p-6 rounded-lg shadow-lg">
//           <h2 className="text-2xl sm:text-3xl font-bold text-green-400">
//             🎉 Quiz Completed!
//           </h2>
//           <p className="text-lg sm:text-xl">
//             Your Score: <span className="font-bold">{calculateScore()}</span> / {questions.length}
//           </p>

//           <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
//             <button
//               onClick={handleAsk}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//             >
//               Ask Me
//             </button>

//             <button
//               onClick={handleSaved}
//               className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//             >
//               Saved
//             </button>

//             <button
//               onClick={handleRetake}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
//             >
//               Retake Quiz
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Quiz;



import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TestInstructions from '../components/TestInstructions';
import PracticeTest from '../components/PracticeTest';
import toast from 'react-hot-toast';

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { topic, quizData } = location.state || {};
  
  const [currentPage, setCurrentPage] = useState('instructions');
  const [testQuestions, setTestQuestions] = useState([]);
  const [testTimeLimit, setTestTimeLimit] = useState(30);

  useEffect(() => {
    if (!quizData) {
      toast.error('No quiz data found');
      navigate('/');
      return;
    }
  }, [quizData, navigate]);

  const parseQuizToTestFormat = (data) => {
    const lines = data.split('\n').filter(line => line.trim());
    const questions = [];
    const answers = {};
    
    let currentQuestion = null;
    let answerSection = false;

    lines.forEach(line => {
      line = line.trim();

      if (line.toLowerCase().startsWith('answers:')) {
        answerSection = true;
        if (currentQuestion) {
          questions.push(currentQuestion);
          currentQuestion = null;
        }
        return;
      }

      if (answerSection) {
        const answerMatch = line.match(/^(\d+)\.\s*([A-D])/i);
        if (answerMatch) {
          const qNum = parseInt(answerMatch[1]);
          const ans = answerMatch[2].toUpperCase();
          answers[qNum] = ans;
        }
        return;
      }

      const questionMatch = line.match(/^(\d+)\.\s*(.+)/);
      if (questionMatch) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          id: parseInt(questionMatch[1]),
          question: questionMatch[2],
          options: []
        };
        return;
      }

      const optionMatch = line.match(/^([A-D])\.\s*(.+)/i);
      if (optionMatch && currentQuestion) {
        const optionLetter = optionMatch[1].toUpperCase();
        const optionText = optionMatch[2];
        currentQuestion.options.push({
          label: optionLetter,
          text: optionText
        });
      }
    });

    if (currentQuestion) {
      questions.push(currentQuestion);
    }

    questions.forEach(q => {
      q.correctAnswer = answers[q.id];
    });

    return questions;
  };

  const formattedTestData = {
    formattedMCQ: quizData
  };

  const handleStartTest = (questions, timeLimit) => {
    setTestQuestions(questions);
    setTestTimeLimit(timeLimit);
    setCurrentPage('test');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleExitTest = () => {
    navigate('/');
  };

  if (currentPage === 'instructions') {
    return (
      <TestInstructions 
        testData={formattedTestData}
        onStartTest={handleStartTest}
        onGoBack={handleGoBack}
      />
    );
  }

  if (currentPage === 'test') {
    return (
      <PracticeTest
        questions={testQuestions}
        timeLimit={testTimeLimit}
        onExit={handleExitTest}
      />
    );
  }

  return null;
}

export default Quiz;