# Engagement Survey Demo

A React-based engagement survey application that demonstrates how to measure organizational culture through core values assessment. This app follows engagement survey best practices with anonymous responses, randomized questions, and comprehensive results analysis.

## Features

- **📊 Core Values Assessment**: Measure how company values manifest in daily work
- **🔀 Randomized Questions**: Reduces bias through question order randomization  
- **📈 Response Rate Tracking**: Monitor participation levels for data validity
- **📱 Mobile-Friendly**: Responsive design for all devices
- **🎯 Actionable Results**: Clear identification of strengths and improvement areas
- **💾 Demo Mode**: Pre-loaded with realistic sample data

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Survey Configuration

### Customizing Core Values

Edit `src/data/values.ts` to define your organization's core values:

```typescript
export const values: Value[] = [
  {
    id: 'collaboration',
    name: 'Collaboration & Teamwork',
    description: 'Working together to achieve shared goals'
  },
  // Add your values here...
];
```

### Adding Questions

Edit `src/data/questions.ts` to create questions for each value (3-5 questions per value recommended):

```typescript
export const questions: Question[] = [
  {
    id: 'col1',
    valueId: 'collaboration', // Must match a value ID
    text: 'It is easy for me to get help from my team members',
    order: 1
  },
  // Add your questions here...
];
```

### Setting Expected Response Count

Edit `src/data/survey.ts` to set how many people should respond:

```typescript
export const survey: Survey = {
  // ... other properties
  expectedResponses: 45 // Number of people you expect to respond
};
```

### Adjusting Mock Data

Edit `src/data/mockResponses.ts` to change the demo results:

```typescript
// Each array represents [1-star, 2-star, 3-star, 4-star, 5-star] percentages
...generateResponses('col1', 25, [0.00, 0.04, 0.06, 0.48, 0.42]), // ~90% positive
```

## Survey Methodology

### Scoring System
- **Question Score**: Percentage of people who answered 4 or 5 (Agree/Strongly Agree)
- **Value Score**: Average of all question scores within that core value
- **Overall Score**: Average of all core value scores
- **Response Rate**: Actual responses / Expected responses

### Interpretation Guidelines
- **80%+ Score**: Excellent performance - celebrate and leverage
- **60-79% Score**: Good performance - maintain current efforts  
- **<60% Score**: Needs attention - prioritize for improvement
- **70%+ Response Rate**: Representative data
- **<50% Response Rate**: Results may not be reliable

## Converting to a Production Survey

This demo app can be extended into a full production survey system:

### 1. Add Database & Backend

**Choose a Backend Stack:**
- **Supabase**: PostgreSQL + Auth + Real-time subscriptions
- **Firebase**: Firestore + Auth + Hosting
- **Custom API**: Node.js/Express + PostgreSQL/MongoDB

**Required Database Tables:**
```sql
-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  created_at TIMESTAMP
);

-- Surveys  
CREATE TABLE surveys (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  title VARCHAR(255),
  description TEXT,
  expected_responses INTEGER,
  status VARCHAR(50), -- 'draft', 'active', 'closed'
  created_at TIMESTAMP,
  closed_at TIMESTAMP
);

-- Values
CREATE TABLE values (
  id UUID PRIMARY KEY,
  survey_id UUID REFERENCES surveys(id),
  name VARCHAR(255),
  description TEXT,
  order_index INTEGER
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY,
  value_id UUID REFERENCES values(id),
  text TEXT,
  order_index INTEGER
);

-- Responses
CREATE TABLE responses (
  id UUID PRIMARY KEY,
  survey_id UUID REFERENCES surveys(id),
  question_id UUID REFERENCES questions(id),
  score INTEGER CHECK (score >= 1 AND score <= 5),
  submitted_at TIMESTAMP
);
```

### 2. Implement Survey Management

**Admin Interface:**
- Create/edit surveys and questions
- Set expected response counts
- Monitor real-time participation
- Close surveys and lock results

**Survey States:**
- **Draft**: Survey being created/edited
- **Active**: Accepting responses
- **Closed**: No more responses, results finalized

### 3. Anonymous Response Collection

**Implementation Options:**

**Option A: Anonymous Links**
```typescript
// Generate unique survey link
const surveyUrl = `https://yourapp.com/survey/${surveyId}`;

// No authentication required
// Each response creates anonymous record
```

**Option B: Email-Based (Semi-Anonymous)**
```typescript
// Send personalized links to track participation
const responseUrl = `https://yourapp.com/survey/${surveyId}?token=${uniqueToken}`;

// Track who responded (for follow-ups) but keep responses anonymous
// Separate participation tracking from actual response data
```

### 4. Response Link Distribution

**During Active Survey:**
- Email distribution to all employees
- Slack/Teams integration
- QR codes for mobile access
- Reminder campaigns for low participation

**Participation Tracking:**
```typescript
// Monitor response rates in real-time
const participationRate = (actualResponses / expectedResponses) * 100;

// Send reminders when participation is low
if (participationRate < 50 && daysActive > 3) {
  sendReminders();
}
```

### 5. Survey Completion & Results

**Automatic Survey Closure:**
```typescript
// Close survey after time limit or target reached
if (responseRate >= 85 || daysActive >= 14) {
  closeSurvey(surveyId);
  generateFinalResults();
  notifyStakeholders();
}
```

**Results Dashboard:**
- Real-time results during active survey
- Final results with trends and comparisons
- Export capabilities (PDF reports, CSV data)
- Historical comparison across survey cycles

### 6. Production Considerations

**Security:**
- Rate limiting on survey responses
- Input validation and sanitization
- GDPR/privacy compliance
- Secure token generation

**Performance:**
- Database indexing for large response volumes
- Caching for real-time dashboards
- CDN for global distribution

**Analytics:**
- Response time tracking
- Device/browser analytics
- Geographic distribution
- Completion rates by question

## Architecture

```
src/
├── components/          # React components
│   ├── SurveyOverview.tsx
│   ├── SurveyForm.tsx
│   └── ResultsDashboard.tsx
├── data/               # Static survey data
│   ├── values.ts
│   ├── questions.ts
│   ├── mockResponses.ts
│   └── survey.ts
├── types/              # TypeScript definitions
│   └── index.ts
├── utils/              # Calculation utilities
│   └── calculations.ts
└── App.tsx            # Main application
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this for your organization's engagement surveys.
