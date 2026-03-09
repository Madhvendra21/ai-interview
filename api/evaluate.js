import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}