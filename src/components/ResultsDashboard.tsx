import type { SurveyResults } from '../types';

interface ResultsDashboardProps {
  results: SurveyResults;
  onBack: () => void;
  onReset?: () => void;
}

export function ResultsDashboard({ results, onBack, onReset }: ResultsDashboardProps) {
  const { valueScores, totalResponses, overallScore } = results;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const sortedValues = [...valueScores].sort((a, b) => b.score - a.score);
  const topValues = sortedValues.slice(0, 3);
  const bottomValues = sortedValues.slice(-3).reverse();

  const exportResults = () => {
    const csvContent = [
      'Value,Score,Question,Question Score,Total Responses',
      ...valueScores.flatMap(value =>
        value.questionScores.map(q =>
          `"${value.valueName}",${value.score},"${q.questionText}",${q.score},${q.totalResponses}`
        )
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'engagement-survey-results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-10 space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Survey Results</h1>
              <p className="text-gray-600">{totalResponses} responses collected</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportResults}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>
          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset Demo</span>
            </button>
          )}
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Overview</span>
          </button>
        </div>
      </div>

      {/* Overall Score */}
      <div className={`rounded-2xl border-2 p-8 mb-10 shadow-lg ${getScoreColor(overallScore)}`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-80 rounded-full mb-6">
            <div className="text-4xl font-bold text-gray-900">{overallScore}%</div>
          </div>
          <div className="text-2xl font-bold mb-3">Overall Engagement Score</div>
          <div className="text-lg font-medium max-w-md mx-auto">
            {overallScore >= 80 ? '🎉 Excellent engagement levels across the organization' :
             overallScore >= 60 ? '👍 Good engagement with opportunities for improvement' :
             '⚠️ Significant engagement challenges that need attention'}
          </div>
        </div>
      </div>

      {/* Value Scores */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Core Values Performance</h2>
          <div className="space-y-4">
            {valueScores.map(value => (
              <div key={value.valueId} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{value.valueName}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(value.score)}`}>
                    {value.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getBarColor(value.score)}`}
                    style={{ width: `${value.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Top Strengths */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">🎉 Top Strengths</h3>
            <div className="space-y-2">
              {topValues.map((value, index) => (
                <div key={value.valueId} className="flex justify-between items-center">
                  <span className="text-green-800">{index + 1}. {value.valueName}</span>
                  <span className="font-semibold text-green-900">{value.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">🔧 Focus Areas</h3>
            <div className="space-y-2">
              {bottomValues.map((value, index) => (
                <div key={value.valueId} className="flex justify-between items-center">
                  <span className="text-amber-800">{index + 1}. {value.valueName}</span>
                  <span className="font-semibold text-amber-900">{value.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Question Results */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Question-Level Results</h2>
        <div className="space-y-8">
          {valueScores.map(value => (
            <div key={value.valueId}>
              <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                {value.valueName} ({value.score}% average)
              </h3>
              <div className="space-y-3">
                {value.questionScores
                  .sort((a, b) => b.score - a.score)
                  .map(question => (
                    <div key={question.questionId} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">{question.questionText}</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className={`h-1.5 rounded-full ${getBarColor(question.score)}`}
                            style={{ width: `${question.score}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <div className="font-medium text-gray-900">{question.score}%</div>
                        <div className="text-xs text-gray-500">{question.totalResponses} responses</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">📊 How Scores Are Calculated</h3>
        <div className="text-blue-800 space-y-2 text-sm">
          <p>• <strong>Question Score:</strong> Percentage of people who answered 4 or 5 (Agree/Strongly Agree)</p>
          <p>• <strong>Value Score:</strong> Average of all question scores within that core value</p>
          <p>• <strong>Overall Score:</strong> Average of all core value scores</p>
          <p>• <strong>Interpretation:</strong> 80%+ is excellent, 60-79% is good, below 60% needs attention</p>
        </div>
      </div>
    </div>
  );
}