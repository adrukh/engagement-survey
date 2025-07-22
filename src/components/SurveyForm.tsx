import { useState, useMemo } from 'react';
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

  // Randomize questions order once when component mounts
  const randomizedQuestions = useMemo(() => {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [questions]);

  const currentQuestion = randomizedQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / randomizedQuestions.length) * 100;
  const currentResponse = responses.find(r => r.questionId === currentQuestion.id);

  const handleResponse = (score: number) => {
    const newResponses = responses.filter(r => r.questionId !== currentQuestion.id);
    newResponses.push({ questionId: currentQuestion.id, score });
    setResponses(newResponses);

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < randomizedQuestions.length - 1) {
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
    if (currentQuestionIndex < randomizedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    if (responses.length === randomizedQuestions.length) {
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

  const isComplete = responses.length === randomizedQuestions.length;
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

      {/* Question or Completion */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-10 mb-10">
        {!isComplete ? (
          <>
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
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                {[1, 2, 3, 4, 5].map(score => (
                  <button
                    key={score}
                    onClick={() => handleResponse(score)}
                    className="group flex-1 flex flex-col items-center p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 transform hover:scale-[1.05] hover:border-blue-300 hover:shadow-md focus:outline-none bg-white"
                  >
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 transition-all ${
                      currentResponse?.score === score 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300 group-hover:border-blue-400'
                    }`}>
                      {currentResponse?.score === score && (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className={`font-bold text-xl mb-1 transition-colors ${
                      currentResponse?.score === score ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'
                    }`}>
                      {score}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Survey Complete!</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Thank you for taking the time to share your feedback.
            </p>
            <button
              onClick={handleSubmit}
              className="group flex items-center space-x-2 px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl mx-auto"
            >
              <span>Submit Survey</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Response summary */}
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm font-medium text-gray-700">
            {responses.length} of {randomizedQuestions.length} questions answered
          </span>
          {responses.length === randomizedQuestions.length && (
            <svg className="w-4 h-4 text-green-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}