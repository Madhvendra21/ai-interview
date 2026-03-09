#!/bin/bash

set -e

echo "🚀 AI Interviewer Deployment Script"
echo "===================================="

# Check if GitHub token is provided
if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️  GITHUB_TOKEN not set"
    echo "Get your token from: https://github.com/settings/tokens"
    echo "Required scopes: repo"
    exit 1
fi

# Configuration
REPO_NAME="skill-checker"
USERNAME="Chauhan27Mahi"

echo "📦 Creating GitHub repository: $REPO_NAME"

# Create GitHub repository
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"private\":false,\"description\":\"AI-powered technical interview platform\"}" || {
    echo "⚠️  Repository may already exist, continuing..."
  }

echo "📤 Pushing code to GitHub..."

# Update remote and push
git remote remove origin 2>/dev/null || true
git remote add origin "https://$USERNAME:$GITHUB_TOKEN@github.com/$USERNAME/$REPO_NAME.git"
git push -u origin main --force

echo "✅ Code pushed to GitHub: https://github.com/$USERNAME/$REPO_NAME"

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm i -g vercel
fi

echo "🌐 Deploying to Vercel..."
echo "You'll need to:"
echo "1. Log in to Vercel (browser will open)"
echo "2. Set environment variable: GEMINI_API_KEY=AIzaSyAWfQmz79_qHkncCUbXqMj0DUTClmhRGqg"

cd frontend
vercel --prod --yes

echo "🎉 Deployment complete!"
echo "Check your Vercel dashboard for the deployed URL"