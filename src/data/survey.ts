import type { Survey } from '../types';
import { values } from './values';
import { questions } from './questions';

export const survey: Survey = {
  id: 'demo-survey-2024',
  title: 'Engagement Survey Demo',
  description: 'A demonstration of how engagement surveys work. This survey measures how well our core values are reflected in day-to-day work.',
  values,
  questions,
  isActive: true,
  expectedResponses: 45
};