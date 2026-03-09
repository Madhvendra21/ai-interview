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

const MOCK_RESPONSES = {
  coding: "Hello! I'm your AI coding interviewer. Let's start with a fundamental question.\n\n**Question:** Write a function to reverse a string without using built-in reverse methods. Consider time and space complexity.\n\nTake your time and explain your approach!",
  system_design: "Hello! I'm your AI system design interviewer. Let's tackle a classic problem.\n\n**Question:** Design a URL shortening service like bit.ly. Consider scalability, database design, and how to handle high traffic.\n\nWhat are your initial thoughts?",
  behavioral: "Hello! I'm your AI behavioral interviewer. I'll be using the STAR method today.\n\n**Question:** Tell me about a time when you faced a difficult technical challenge. How did you approach it, and what was the outcome?\n\nPlease provide specific details using the Situation, Task, Action, Result framework.",
  dsa: "Hello! I'm your AI DSA interviewer. Let's test your algorithmic thinking.\n\n**Question:** Given an array of integers, find two numbers that add up to a specific target. Optimize for time complexity.\n\nWhat's your approach?",
  tech_stack: "Hello! I'm your AI technical interviewer. Let's dive into your tech stack knowledge.\n\n**Question:** Explain how React's Virtual DOM works and why it's beneficial. Also, discuss the differences between useState and useEffect hooks.\n\nTake your time with the explanation!"
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { skillType, difficulty, techStack } = req.body;
    
    // Try AI first, fallback to mock if quota exceeded
    try {
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

      return res.json({ 
        success: true, 
        message: text,
        interviewId: Date.now().toString()
      });
    } catch (aiError) {
      // Fallback to mock response if AI quota exceeded
      console.log('AI quota exceeded, using mock response');
      const mockMessage = MOCK_RESPONSES[skillType] || MOCK_RESPONSES.coding;
      
      return res.json({ 
        success: true, 
        message: mockMessage + "\n\n*(Note: Using demo mode due to API limits)*",
        interviewId: Date.now().toString(),
        demoMode: true
      });
    }
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
