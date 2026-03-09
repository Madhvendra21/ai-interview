import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAWfQmz79_qHkncCUbXqMj0DUTClmhRGqg');

const INTERVIEW_PROMPTS = {
  coding: `You are a technical interviewer assessing coding skills. Ask a coding question, then evaluate the response based on:
- Code correctness and efficiency
- Edge case handling
- Code readability and structure
- Time/space complexity awareness

Provide a score out of 10 and specific feedback.`,

  system_design: `You are a technical interviewer assessing system design skills. Ask a system design question, then evaluate the response based on:
- Architecture understanding
- Scalability considerations
- Database design
- Trade-off analysis

Provide a score out of 10 and specific feedback.`,

  behavioral: `You are an interviewer assessing behavioral/soft skills using the STAR method. Ask behavioral questions, then evaluate based on:
- Communication clarity
- Problem-solving approach
- Teamwork and collaboration
- Leadership and initiative

Provide a score out of 10 and specific feedback.`,

  dsa: `You are a technical interviewer assessing Data Structures and Algorithms knowledge. Ask DSA questions, then evaluate based on:
- Algorithm selection
- Complexity analysis
- Optimization techniques
- Problem decomposition

Provide a score out of 10 and specific feedback.`,

  tech_stack: `You are a technical interviewer assessing specific technology knowledge. Ask questions about the specified tech stack, then evaluate based on:
- Framework/library knowledge
- Best practices
- Real-world application
- Debugging skills

Provide a score out of 10 and specific feedback.`
};

app.post('/api/start-interview', async (req, res) => {
  try {
    const { skillType, difficulty, techStack } = req.body;
    
    let systemPrompt = INTERVIEW_PROMPTS[skillType] || INTERVIEW_PROMPTS.coding;
    
    if (skillType === 'tech_stack' && techStack) {
      systemPrompt += `\nFocus on: ${techStack}`;
    }
    
    systemPrompt += `\nDifficulty level: ${difficulty || 'intermediate'}`;
    systemPrompt += `\n\nStart by introducing yourself as an AI interviewer and ask the first question. Be professional but friendly.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ 
      success: true, 
      message: text,
      interviewId: Date.now().toString()
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, skillType } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      })),
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ success: true, message: text });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/evaluate', async (req, res) => {
  try {
    const { history, skillType } = req.body;
    
    const evaluationPrompt = `Based on the following interview conversation, provide a detailed evaluation:

${history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Provide your evaluation in this exact format:
SKILL_TYPE: ${skillType}
OVERALL_SCORE: [0-10]
STRENGTHS:
- [strength 1]
- [strength 2]
AREAS_FOR_IMPROVEMENT:
- [area 1]
- [area 2]
DETAILED_FEEDBACK: [2-3 sentences of specific feedback]`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(evaluationPrompt);
    const response = await result.response;
    const text = response.text();

    const lines = text.split('\n');
    let overallScore = 5;
    let strengths = [];
    let areasForImprovement = [];
    let detailedFeedback = '';
    let parsingStrengths = false;
    let parsingAreas = false;
    let parsingFeedback = false;

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('OVERALL_SCORE:')) {
        const score = parseFloat(trimmed.split(':')[1]);
        if (!isNaN(score)) overallScore = Math.min(10, Math.max(0, score));
      } else if (trimmed === 'STRENGTHS:') {
        parsingStrengths = true;
        parsingAreas = false;
        parsingFeedback = false;
      } else if (trimmed === 'AREAS_FOR_IMPROVEMENT:') {
        parsingStrengths = false;
        parsingAreas = true;
        parsingFeedback = false;
      } else if (trimmed.startsWith('DETAILED_FEEDBACK:')) {
        parsingStrengths = false;
        parsingAreas = false;
        parsingFeedback = true;
        detailedFeedback = trimmed.split(':').slice(1).join(':').trim();
      } else if (trimmed.startsWith('-') && parsingStrengths) {
        strengths.push(trimmed.substring(1).trim());
      } else if (trimmed.startsWith('-') && parsingAreas) {
        areasForImprovement.push(trimmed.substring(1).trim());
      } else if (parsingFeedback && trimmed) {
        detailedFeedback += ' ' + trimmed;
      }
    }

    res.json({
      success: true,
      evaluation: {
        overallScore,
        strengths,
        areasForImprovement,
        detailedFeedback: detailedFeedback.trim()
      }
    });
  } catch (error) {
    console.error('Error evaluating interview:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});