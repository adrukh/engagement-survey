# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an engagement survey demo application built with React + TypeScript + Vite. It demonstrates how to run employee engagement surveys based on core company values, following the methodology outlined in `engagement-survey.md`.

## Key Architecture

- **Frontend-only application**: No backend or database required
- **Static data approach**: Survey content is defined in TypeScript files for easy customization
- **Local storage**: User responses are saved locally for demo purposes
- **Modular component design**: Easy to extend for real survey implementations

## Important Files

- `src/data/` - Contains all survey content (values, questions, mock responses)
- `src/types/index.ts` - TypeScript definitions for the survey domain
- `src/utils/calculations.ts` - Score calculation logic (% of 4-5 responses)
- `src/components/` - React components for each view (Overview, Survey, Results)

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Customizing the Survey

To adapt this for a real organization:

1. **Update survey content** in `src/data/values.ts` and `src/data/questions.ts`
2. **Replace mock responses** with real data collection (API integration)
3. **Add authentication** if needed for survey management
4. **Extend results dashboard** with additional charts and export options

## Survey Methodology

- Questions use 1-5 scale (Strongly Disagree to Strongly Agree)
- Scores calculated as % of people who answered 4 or 5
- Value scores are averages of their question scores
- Results show strengths (80%+) and areas needing attention (<60%)

## Extension Points

The app is designed for easy extension to support:
- Multiple surveys and organizations
- Real-time data collection and persistence
- Advanced analytics and trend analysis
- Survey management interfaces