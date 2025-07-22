import { useState } from 'react';
import type { Question, Response } from '../types';

interface SurveyFormProps {
  questions: Question[];
  onComplete: (responses: Response[]) => void;
  onBack: () => void;
}

interface FormResponse {
  questionId: string;
  score: number;
}

export function SurveyForm({ questions, onComplete, onBack }: SurveyFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentResponse = responses.find(r => r.questionId === currentQuestion.id);

  const handleResponse = (score: number) => {
    const newResponses = responses.filter(r => r.questionId !== currentQuestion.id);
    newResponses.push({ questionId: currentQuestion.id, score });
    setResponses(newResponses);

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 600);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    if (responses.length === questions.length) {
      setIsSubmitting(true);
      const surveyResponses: Response[] = responses.map(r => ({
        questionId: r.questionId,
        score: r.score,
        timestamp: new Date()
      }));
      
      // Simulate submission delay
      setTimeout(() => {
        onComplete(surveyResponses);
      }, 1000);
    }
  };

  const isComplete = responses.length === questions.length;
  const canProceed = currentResponse !== undefined;

  if (isSubmitting) {
    return (
      <div className="max-w-2xl mx-auto p-6 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Submitting your responses...</h2>
          <p className="text-gray-600">Thank you for taking the time to share your feedback!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition-colors group"
          >
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Overview</span>
          </button>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Question</div>
            <div className="text-lg font-semibold text-gray-900">
              {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 rounded-full animate-pulse"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Start</span>
          <span>{Math.round(progress)}% Complete</span>
          <span>Finish</span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-10 mb-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-relaxed max-w-lg mx-auto">
            {currentQuestion.text}
          </h2>
          <p className="text-gray-600 mb-8">Please select your level of agreement:</p>
        </div>

        {/* Response options */}
        <div className="space-y-4">
          {[
            { score: 1, label: 'Strongly Disagree', color: 'from-red-50 to-red-100 border-red-200 hover:border-red-300 text-red-800', ring: 'focus:ring-red-500' },
            { score: 2, label: 'Disagree', color: 'from-orange-50 to-orange-100 border-orange-200 hover:border-orange-300 text-orange-800', ring: 'focus:ring-orange-500' },
            { score: 3, label: 'Neutral', color: 'from-yellow-50 to-yellow-100 border-yellow-200 hover:border-yellow-300 text-yellow-800', ring: 'focus:ring-yellow-500' },
            { score: 4, label: 'Agree', color: 'from-green-50 to-green-100 border-green-200 hover:border-green-300 text-green-800', ring: 'focus:ring-green-500' },
            { score: 5, label: 'Strongly Agree', color: 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300 text-blue-800', ring: 'focus:ring-blue-500' }
          ].map(option => (
            <button
              key={option.score}
              onClick={() => handleResponse(option.score)}
              className={`group w-full p-5 border-2 rounded-xl text-left transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 ${option.ring} ${
                currentResponse?.score === option.score
                  ? `bg-gradient-to-r ${option.color} border-opacity-100 scale-[1.02] shadow-md`
                  : `bg-gradient-to-r ${option.color} border-opacity-60 hover:border-opacity-100 hover:shadow-md`
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                    currentResponse?.score === option.score 
                      ? 'bg-gray-800 border-gray-800' 
                      : 'border-gray-400 group-hover:border-gray-600'
                  }`}>
                    {currentResponse?.score === option.score && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{option.score}</div>
                    <div className="font-medium">{option.label}</div>
                  </div>
                </div>
                {currentResponse?.score === option.score && (
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="group flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        <div className="flex space-x-4">
          {!isComplete ? (
            <button
              onClick={handleNext}
              disabled={!canProceed || currentQuestionIndex === questions.length - 1}
              className="group flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <span>Next</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="group flex items-center space-x-2 px-10 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <span>Submit Survey</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Response summary */}
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm font-medium text-gray-700">
            {responses.length} of {questions.length} questions answered
          </span>
          {responses.length === questions.length && (
            <svg className="w-4 h-4 text-green-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}