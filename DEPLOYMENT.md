# Deployment Guide

## Prerequisites

1. Create GitHub repository at: https://github.com/new
   - Name: `skill-checker` (or your preferred name)
   - Make it public or private

2. Install Vercel CLI (optional):
   ```bash
   npm i -g vercel
   ```

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

```bash
cd ai-interviewer

# If repository doesn't exist, create it first on GitHub, then:
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/skill-checker.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Other (or Vite for frontend-only)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: (leave empty)

4. Add Environment Variables:
   ```
   GEMINI_API_KEY=AIzaSyAWfQmz79_qHkncCUbXqMj0DUTClmhRGqg
   ```

5. Click Deploy

### Step 3: Update API URL

After deployment, update `frontend/src/services/api.ts`:
```typescript
const API_URL = 'https://your-vercel-app.vercel.app/api';
```

## Option 2: Local Development

### Terminal 1 - Start Server
```bash
cd ai-interviewer/server
npm install
npm start
# Server runs on http://localhost:3001
```

### Terminal 2 - Start Frontend
```bash
cd ai-interviewer/frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## Option 3: Deploy Frontend & Backend Separately

### Backend (Render/Railway/Heroku)
1. Push server folder to separate repo or use same repo
2. Deploy server to Render/Railway
3. Set environment variable: `GEMINI_API_KEY`

### Frontend (Vercel/Netlify)
1. Connect frontend to Vercel
2. Set environment variable: `VITE_API_URL=https://your-backend-url.com`

## File Structure

```
ai-interviewer/
├── frontend/          # React + TypeScript app
│   ├── src/
│   │   ├── pages/    # Home, Setup, Interview, Results, History
│   │   ├── components/
│   │   ├── services/ # API & storage
│   │   └── contexts/ # Interview state
│   └── package.json
├── server/           # Express + Gemini API
│   ├── server.js
│   └── package.json
├── vercel.json       # Vercel deployment config
└── README.md
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

Get your API key from: https://aistudio.google.com/app/apikey

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Can start new interview
- [ ] AI responds to messages
- [ ] Can complete interview
- [ ] Results page shows scores
- [ ] History page saves interviews

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify API key is set correctly
3. Check Vercel deployment logs
4. Ensure all environment variables are configured