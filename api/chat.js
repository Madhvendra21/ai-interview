import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyC1OmZNQU0GVgRD5tK3YmaIk77f0aUdvTQ');

const MOCK_FOLLOWUPS = [
  "That's an interesting approach! Can you explain your thought process in more detail?",
  "Good start! How would you optimize this solution for larger inputs?",
  "I see. What edge cases should we consider here?",
  "Interesting! Can you walk me through the time and space complexity?",
  "That's one way to do it. Is there a more efficient algorithm you could use?",
  "Great explanation! How would you test this solution?",
  "Nice work! Do you see any potential bugs or issues with your approach?"
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;
    
    // Try AI first, fallback to mock
    try {
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

      return res.json({ success: true, message: text });
    } catch (aiError) {
      // Fallback to mock response
      console.log('AI quota exceeded, using mock chat response');
      const randomResponse = MOCK_FOLLOWUPS[Math.floor(Math.random() * MOCK_FOLLOWUPS.length)];
      
      return res.json({ 
        success: true, 
        message: randomResponse + "\n\n*(Demo mode - limited responses)*",
        demoMode: true
      });
    }
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
