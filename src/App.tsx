import { useState, useEffect } from 'react';
import type { ViewMode, Response, SurveyResults } from './types';
import { SurveyOverview } from './components/SurveyOverview';
import { SurveyForm } from './components/SurveyForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ViewTransition } from './components/ViewTransition';
import { survey } from './data/survey';
import { mockResponses } from './data/mockResponses';
import { calculateSurveyResults } from './utils/calculations';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('overview');
  const [, setUserResponses] = useState<Response[]>([]);
  const [allResponses, setAllResponses] = useState<Response[]>(mockResponses);

  // Load user responses from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('survey-responses');
    if (saved) {
      try {
        const responses = JSON.parse(saved);
        setUserResponses(responses);
        // Include user responses in calculations
        setAllResponses([...mockResponses, ...responses]);
      } catch (error) {
        console.error('Error loading saved responses:', error);
      }
    }
  }, []);

  const handleSurveyComplete = (responses: Response[]) => {
    setUserResponses(responses);
    // Save to localStorage
    localStorage.setItem('survey-responses', JSON.stringify(responses));
    // Include in calculations
    setAllResponses([...mockResponses, ...responses]);
    // Show results
    setCurrentView('results');
  };

  const handleReset = () => {
    setUserResponses([]);
    setAllResponses(mockResponses);
    localStorage.removeItem('survey-responses');
    setCurrentView('overview');
  };

  const results: SurveyResults = calculateSurveyResults(
    survey.values,
    survey.questions,
    allResponses,
    survey.expectedResponses
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <ViewTransition viewKey={currentView}>
        {currentView === 'overview' && (
          <SurveyOverview
            survey={survey}
            onStartSurvey={() => setCurrentView('survey')}
            onViewResults={() => setCurrentView('results')}
          />
        )}

        {currentView === 'survey' && (
          <SurveyForm
            questions={survey.questions}
            onComplete={handleSurveyComplete}
            onBack={() => setCurrentView('overview')}
          />
        )}

        {currentView === 'results' && (
          <ResultsDashboard
            results={results}
            onBack={() => setCurrentView('overview')}
            onReset={handleReset}
          />
        )}
      </ViewTransition>
      
      <footer className="mt-auto py-4 text-center text-sm text-gray-600 bg-white/50">
        <a 
          href="https://github.com/adrukh/engagement-survey" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          View source code on GitHub
        </a>
      </footer>
    </div>
  );
}

export default App;
