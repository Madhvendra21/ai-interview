import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyC1OmZNQU0GVgRD5tK3YmaIk77f0aUdvTQ');

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}