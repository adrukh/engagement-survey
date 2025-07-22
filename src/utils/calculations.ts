import type { Response, Question, Value, QuestionScore, ValueScore, SurveyResults } from '../types';

export function calculateQuestionScore(questionId: string, responses: Response[]): QuestionScore {
  const questionResponses = responses.filter(r => r.questionId === questionId);
  const totalResponses = questionResponses.length;
  
  if (totalResponses === 0) {
    return {
      questionId,
      questionText: '',
      valueId: '',
      score: 0,
      totalResponses: 0
    };
  }
  
  const positiveResponses = questionResponses.filter(r => r.score >= 4).length;
  const score = Math.round((positiveResponses / totalResponses) * 100);
  
  return {
    questionId,
    questionText: '',
    valueId: '',
    score,
    totalResponses
  };
}

export function calculateValueScore(valueId: string, questions: Question[], responses: Response[]): ValueScore {
  const valueQuestions = questions.filter(q => q.valueId === valueId);
  const questionScores = valueQuestions.map(q => calculateQuestionScore(q.id, responses));
  
  // Fill in question details
  questionScores.forEach(qs => {
    const question = valueQuestions.find(q => q.id === qs.questionId);
    if (question) {
      qs.questionText = question.text;
      qs.valueId = valueId;
    }
  });
  
  const avgScore = questionScores.length > 0 
    ? Math.round(questionScores.reduce((sum, qs) => sum + qs.score, 0) / questionScores.length)
    : 0;
  
  return {
    valueId,
    valueName: '',
    score: avgScore,
    questionScores
  };
}

export function calculateSurveyResults(
  values: Value[],
  questions: Question[],
  responses: Response[],
  expectedResponses?: number
): SurveyResults {
  const valueScores = values.map(value => {
    const valueScore = calculateValueScore(value.id, questions, responses);
    valueScore.valueName = value.name;
    return valueScore;
  });
  
  const totalResponses = Math.max(...valueScores.map(vs => 
    Math.max(...vs.questionScores.map(qs => qs.totalResponses), 0)
  ), 0);
  
  const overallScore = valueScores.length > 0
    ? Math.round(valueScores.reduce((sum, vs) => sum + vs.score, 0) / valueScores.length)
    : 0;

  const responseRate = expectedResponses && expectedResponses > 0
    ? Math.round((totalResponses / expectedResponses) * 100)
    : undefined;
  
  return {
    totalResponses,
    expectedResponses,
    responseRate,
    valueScores,
    overallScore
  };
}