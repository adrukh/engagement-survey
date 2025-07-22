import type { Response } from '../types';

// Generate realistic mock responses for 25 participants
// Distribution roughly: 10% score 1-2, 30% score 3, 60% score 4-5
export const mockResponses: Response[] = [
  // Collaboration questions (generally strong)
  ...generateResponses('col1', 25, [0.05, 0.05, 0.20, 0.40, 0.30]),
  ...generateResponses('col2', 25, [0.08, 0.12, 0.25, 0.35, 0.20]),
  ...generateResponses('col3', 25, [0.04, 0.08, 0.28, 0.40, 0.20]),
  ...generateResponses('col4', 25, [0.04, 0.04, 0.22, 0.45, 0.25]),

  // Customer focus (mixed results)
  ...generateResponses('cus1', 25, [0.12, 0.16, 0.32, 0.28, 0.12]),
  ...generateResponses('cus2', 25, [0.08, 0.12, 0.40, 0.28, 0.12]),
  ...generateResponses('cus3', 25, [0.04, 0.08, 0.28, 0.35, 0.25]),
  ...generateResponses('cus4', 25, [0.08, 0.08, 0.24, 0.40, 0.20]),

  // Growth (room for improvement)
  ...generateResponses('gro1', 25, [0.16, 0.20, 0.32, 0.24, 0.08]),
  ...generateResponses('gro2', 25, [0.12, 0.16, 0.36, 0.28, 0.08]),
  ...generateResponses('gro3', 25, [0.08, 0.12, 0.35, 0.30, 0.15]),
  ...generateResponses('gro4', 25, [0.20, 0.16, 0.28, 0.24, 0.12]),

  // Transparency (strong)
  ...generateResponses('tra1', 25, [0.04, 0.08, 0.20, 0.38, 0.30]),
  ...generateResponses('tra2', 25, [0.08, 0.08, 0.24, 0.35, 0.25]),
  ...generateResponses('tra3', 25, [0.04, 0.12, 0.24, 0.40, 0.20]),
  ...generateResponses('tra4', 25, [0.12, 0.08, 0.20, 0.35, 0.25]),

  // Well-being (needs attention)
  ...generateResponses('wel1', 25, [0.24, 0.20, 0.28, 0.20, 0.08]),
  ...generateResponses('wel2', 25, [0.20, 0.24, 0.32, 0.16, 0.08]),
  ...generateResponses('wel3', 25, [0.16, 0.20, 0.36, 0.20, 0.08]),
  ...generateResponses('wel4', 25, [0.28, 0.16, 0.28, 0.20, 0.08]) // eNPS question
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