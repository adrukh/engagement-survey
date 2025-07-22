import type { Response } from '../types';

// Generate realistic mock responses for 25 participants
// Target support levels with variance: Collaboration 87%, Customer Focus 74%, Tech Innovation 65%, Feedback 55%
// One question in each group scores ~20% lower than group average
export const mockResponses: Response[] = [
  // Collaboration questions (87% average - very strong)
  ...generateResponses('col1', 25, [0.00, 0.04, 0.06, 0.48, 0.42]), // ~90%
  ...generateResponses('col2', 25, [0.00, 0.04, 0.08, 0.46, 0.42]), // ~88% 
  ...generateResponses('col3', 25, [0.00, 0.04, 0.10, 0.44, 0.42]), // ~86%
  ...generateResponses('col4', 25, [0.12, 0.16, 0.17, 0.35, 0.20]), // ~55% (low outlier)

  // Customer focus (74% average - strong performance)
  ...generateResponses('cus1', 25, [0.04, 0.08, 0.12, 0.44, 0.32]), // ~76%
  ...generateResponses('cus2', 25, [0.08, 0.04, 0.12, 0.46, 0.30]), // ~76%
  ...generateResponses('cus3', 25, [0.04, 0.08, 0.16, 0.42, 0.30]), // ~72%
  ...generateResponses('cus4', 25, [0.20, 0.16, 0.18, 0.32, 0.14]), // ~46% (low outlier)

  // Technical Innovation (65% average - moderate)
  ...generateResponses('inn1', 25, [0.08, 0.12, 0.12, 0.40, 0.28]), // ~68%
  ...generateResponses('inn2', 25, [0.08, 0.12, 0.16, 0.38, 0.26]), // ~64%
  ...generateResponses('inn3', 25, [0.12, 0.08, 0.16, 0.40, 0.24]), // ~64%
  ...generateResponses('inn4', 25, [0.24, 0.20, 0.20, 0.28, 0.08]), // ~36% (low outlier)

  // Feedback & Recognition (55% average - needs improvement)
  ...generateResponses('fee1', 25, [0.16, 0.12, 0.14, 0.36, 0.22]), // ~58%
  ...generateResponses('fee2', 25, [0.12, 0.16, 0.16, 0.34, 0.22]), // ~56%
  ...generateResponses('fee3', 25, [0.16, 0.12, 0.18, 0.36, 0.18]), // ~54%
  ...generateResponses('fee4', 25, [0.28, 0.20, 0.20, 0.24, 0.08]), // ~32% (low outlier - eNPS)
];

function generateResponses(questionId: string, count: number, distribution: number[]): Response[] {
  const responses: Response[] = [];
  const baseTime = new Date('2024-01-15T09:00:00Z');
  
  distribution.forEach((percentage, scoreIndex) => {
    const responseCount = Math.round(count * percentage);
    for (let i = 0; i < responseCount; i++) {
      responses.push({
        questionId,
        score: scoreIndex + 1,
        timestamp: new Date(baseTime.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) // Random within a week
      });
    }
  });
  
  return responses;
}