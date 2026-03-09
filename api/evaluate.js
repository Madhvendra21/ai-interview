import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyC1OmZNQU0GVgRD5tK3YmaIk77f0aUdvTQ');

const generateMockEvaluation = (skillType) => {
  const mockEvaluations = {
    coding: {
      overallScore: 7.5,
      strengths: ["Good understanding of algorithm basics", "Clear code structure"],
      areasForImprovement: ["Optimize time complexity", "Add more edge case handling"],
      detailedFeedback: "You demonstrated solid coding fundamentals. Your solution works correctly for most cases, but there's room for optimization. Consider reviewing data structures to improve efficiency."
    },
    system_design: {
      overallScore: 7.0,
      strengths: ["Good grasp of scalability concepts", "Clear communication of ideas"],
      areasForImprovement: ["Consider database indexing strategies", "Discuss trade-offs more explicitly"],
      detailedFeedback: "You showed good understanding of distributed systems. Your architecture was reasonable, but could benefit from more detailed discussion of bottlenecks and solutions."
    },
    behavioral: {
      overallScore: 8.0,
      strengths: ["Excellent communication skills", "Strong problem-solving examples"],
      areasForImprovement: ["Provide more specific metrics", "Discuss team dynamics more"],
      detailedFeedback: "Your behavioral responses were well-structured using STAR. You provided clear examples of leadership and collaboration. Consider adding more quantifiable results."
    },
    dsa: {
      overallScore: 6.5,
      strengths: ["Good algorithm selection", "Understood complexity basics"],
      areasForImprovement: ["Practice more optimization techniques", "Work on space complexity"],
      detailedFeedback: "You have a decent foundation in DSA. Focus on practicing more complex problems and optimizing both time and space complexity in your solutions."
    },
    tech_stack: {
      overallScore: 7.5,
      strengths: ["Good framework knowledge", "Practical experience evident"],
      areasForImprovement: ["Deeper understanding of internals", "More knowledge of best practices"],
      detailedFeedback: "You showed good practical knowledge of the tech stack. To improve, dive deeper into how the technologies work under the hood and stay updated with latest patterns."
    }
  };
  
  return mockEvaluations[skillType] || mockEvaluations.coding;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { history, skillType } = req.body;
    
    // Try AI first, fallback to mock
    try {
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

      return res.json({
        success: true,
        evaluation: {
          overallScore,
          strengths,
          areasForImprovement,
          detailedFeedback: detailedFeedback.trim()
        }
      });
    } catch (aiError) {
      // Fallback to mock evaluation
      console.log('AI quota exceeded, using mock evaluation');
      const mockEval = generateMockEvaluation(skillType);
      
      return res.json({
        success: true,
        evaluation: {
          ...mockEval,
          demoMode: true
        }
      });
    }
  } catch (error) {
    console.error('Error evaluating interview:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
