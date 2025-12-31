import React, { useState, useEffect } from 'react';

function PracticeTest({ questions, timeLimit, onExit }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answer) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  console.log(questions);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Questions Available</h2>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = userAnswers[currentQuestion.id];

  if (!currentQuestion || !currentQuestion.options || currentQuestion.options.length !== 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Invalid Question Format</h2>
          <p className="text-gray-600 mb-4">Question must have exactly 4 options</p>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Practice Test</h2>
                <p className="text-gray-600 mt-1">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Time Remaining</div>
                <div className={`text-3xl font-bold ${timeRemaining < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-md mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentQuestion.question}
              </h3>
            </div>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleAnswerSelect(currentQuestion.id, option.label)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    userAnswer === option.label
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <span className="font-bold text-blue-600 mr-3">{option.label}.</span>
                    <span className="text-gray-800">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                Previous
              </button>

              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
              >
                Submit Test
              </button>

              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  currentQuestionIndex === questions.length - 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const score = calculateScore();
  const percentage = ((score / questions.length) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Test Results</h2>
          
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-md mb-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">{score}</div>
                <div className="text-gray-600 mt-1">Correct</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">{questions.length - score}</div>
                <div className="text-gray-600 mt-1">Incorrect</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{percentage}%</div>
                <div className="text-gray-600 mt-1">Score</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Your Answers</h3>
            <p className="text-gray-600 mb-4">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>

            <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-md mb-6">
              <h4 className="text-lg font-semibold text-gray-900">
                {currentQuestion.question}
              </h4>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option) => {
                const isCorrect = option.label === currentQuestion.correctAnswer;
                const isUserAnswer = userAnswer === option.label;
                
                let bgColor = 'bg-white border-gray-300';
                let textColor = 'text-gray-800';
                
                if (isCorrect) {
                  bgColor = 'bg-green-100 border-green-500';
                  textColor = 'text-green-900';
                } else if (isUserAnswer && !isCorrect) {
                  bgColor = 'bg-red-100 border-red-500';
                  textColor = 'text-red-900';
                }

                return (
                  <div
                    key={option.label}
                    className={`p-4 rounded-lg border-2 ${bgColor}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        <span className={`font-bold mr-3 ${textColor}`}>{option.label}.</span>
                        <span className={textColor}>{option.text}</span>
                      </div>
                      {isCorrect && (
                        <span className="ml-3 text-green-600 font-semibold">Correct</span>
                      )}
                      {isUserAnswer && !isCorrect && (
                        <span className="ml-3 text-red-600 font-semibold">Your Answer</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                Previous
              </button>

              <button
                onClick={onExit}
                className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Exit Test
              </button>

              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  currentQuestionIndex === questions.length - 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PracticeTest;