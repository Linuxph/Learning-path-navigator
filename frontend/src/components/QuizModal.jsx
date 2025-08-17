import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizModal = ({ quizData, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const currentQuestion = quizData[currentQuestionIndex];
  const correctAnswerKey = currentQuestion.answer;

  const handleOptionSelect = (optionKey) => {
    if (showAnswer) return; 
    setSelectedOption(optionKey);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    setShowAnswer(true);
    if (selectedOption === correctAnswerKey) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      setIsQuizFinished(true);
    }
  };
  
  const getButtonClass = (optionKey) => {
    if (showAnswer) {
      if (optionKey === correctAnswerKey) return 'bg-green-500 text-white'; // Correct answer
      if (optionKey === selectedOption) return 'bg-red-500 text-white'; // Incorrectly selected
      return 'bg-slate-200 text-slate-500'; // Other options
    }
    if (selectedOption === optionKey) {
      return 'bg-blue-500 text-white'; // Currently selected
    }
    return 'bg-white hover:bg-slate-100'; // Default
  };

  if (isQuizFinished) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Quiz Finished!</h2>
        <p className="text-xl text-slate-700 mb-6">
          Your final score is: <span className="font-bold text-blue-600">{score} / {quizData.length}</span>
        </p>
        <button onClick={onClose} className="px-6 py-2 bg-pink-500 text-white rounded font-semibold">
          Close
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Quiz Time! ({currentQuestionIndex + 1}/{quizData.length})</h2>
      <p className="text-lg text-slate-700 mb-6">{currentQuestion.question}</p>

      <div className="space-y-3 mb-6">
        {Object.entries(currentQuestion.options).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleOptionSelect(key)}
            disabled={showAnswer}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${getButtonClass(key)}`}
          >
            <span className="font-bold mr-2">{key}.</span> {value}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!showAnswer ? (
          <motion.button
            key="submit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg disabled:bg-slate-300"
          >
            Submit Answer
          </motion.button>
        ) : (
          <motion.button
            key="next"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleNextQuestion}
            className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg"
          >
            {currentQuestionIndex < quizData.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizModal;