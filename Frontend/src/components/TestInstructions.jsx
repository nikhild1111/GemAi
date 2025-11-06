import React, { useState } from 'react';

function TestInstructions({ testData, onStartTest, onGoBack }) {
  const [timeLimit, setTimeLimit] = useState(30);

  if (!testData || !testData.formattedMCQ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Test Data Found</h2>
          <button
            onClick={onGoBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back to Create Test
          </button>
        </div>
      </div>
    );
  }

  const parseQuestions = (formattedText) => {
    const lines = formattedText.trim().split('\n').filter(line => line.trim());
    const questions = [];
    let currentQuestion = null;
    let isAnswerSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.toLowerCase().includes('answers:') || line.toLowerCase() === 'answers') {
        isAnswerSection = true;
        continue;
      }

      if (isAnswerSection) {
        const answerMatch = line.match(/^(\d+)\.\s*([A-D])/);
        if (answerMatch) {
          const qId = parseInt(answerMatch[1]);
          const correctAns = answerMatch[2];
          const question = questions.find(q => q.id === qId);
          if (question) {
            question.correctAnswer = correctAns;
          }
        }
        continue;
      }

      const questionMatch = line.match(/^(\d+)\.\s+(.+)/);
      if (questionMatch && !line.match(/^(\d+)\.\s*[A-D]\s*$/)) {
        if (currentQuestion && currentQuestion.options.length > 0) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          id: parseInt(questionMatch[1]),
          question: questionMatch[2],
          options: []
        };
      } else if (currentQuestion) {
        const optionMatch = line.match(/^([A-D])\.\s+(.+)/);
        if (optionMatch) {
          currentQuestion.options.push({
            label: optionMatch[1],
            text: optionMatch[2]
          });
        }
      }
    }

    if (currentQuestion && currentQuestion.options.length > 0) {
      questions.push(currentQuestion);
    }

    return questions.filter(q => q.options.length === 4);
  };

  const questions = parseQuestions(testData.formattedMCQ);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Valid Questions Found</h2>
          <p className="text-gray-600 mb-4">Unable to parse questions from the extracted text</p>
          <button
            onClick={onGoBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back to Create Test
          </button>
        </div>
      </div>
    );
  }

  const handleStartTest = () => {
    onStartTest(questions, timeLimit);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Instructions</h1>
          <p className="text-gray-600">Please read carefully before starting the test</p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-md mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Details</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-blue-200">
              <span className="text-gray-700 font-medium">Total Questions:</span>
              <span className="text-blue-600 font-bold text-lg">{questions.length}</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700 font-medium">Time Limit:</span>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) || 30)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-blue-600 font-bold">minutes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Instructions</h2>
          
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-3 mt-1">1.</span>
              <span>Once you start the test, the timer will begin and cannot be paused</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-3 mt-1">2.</span>
              <span>You can select only one option per question</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-3 mt-1">3.</span>
              <span>You can navigate between questions using Previous and Next buttons</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-3 mt-1">4.</span>
              <span>You can submit the test anytime before the timer expires</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-3 mt-1">5.</span>
              <span>The test will auto-submit when time runs out</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-3 mt-1">6.</span>
              <span>After submission, you can review your answers with correct solutions highlighted in green and incorrect in red</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={onGoBack}
            className="px-8 py-3 bg-gray-500 text-white rounded-md font-medium hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={handleStartTest}
            className="px-8 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
          >
            Start Test Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestInstructions;