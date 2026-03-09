# AI Interviewer

AI-powered technical interview platform using Google Gemini API. Practice coding, system design, behavioral, DSA, and tech stack interviews with instant AI feedback.

## Features

- **Multiple Interview Types**: Coding, System Design, Behavioral, DSA, Tech Stack
- **AI-Powered Interviews**: Realistic interview experience using Google Gemini
- **Instant Feedback**: Detailed scoring, strengths, and areas for improvement
- **Skill Visualization**: Radar charts showing your skill breakdown
- **Interview History**: Track progress over time
- **Difficulty Levels**: Beginner, Intermediate, Advanced

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Express.js + Google Generative AI
- **Charts**: Recharts
- **Icons**: Lucide React

## Quick Start

### Prerequisites

- Node.js 18+
- Google Gemini API Key

### Local Development

1. **Clone and Setup**
   ```bash
   git clone https://github.com/Chauhan27Mahi/skill-checker.git
   cd skill-checker
   ```

2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   npm start
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Open** http://localhost:5173

### Environment Variables

Create `.env` in server folder:
```
GEMINI_API_KEY=your_api_key_here
PORT=3001
```

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## API Endpoints

- `POST /api/start-interview` - Start new interview
- `POST /api/chat` - Send message to AI
- `POST /api/evaluate` - Get interview evaluation

## License

MIT