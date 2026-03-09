export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface InterviewConfig {
  skillType: 'coding' | 'system_design' | 'behavioral' | 'dsa' | 'tech_stack';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  techStack?: string;
  duration: number;
}

export interface Evaluation {
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  detailedFeedback: string;
}

export interface Interview {
  id: string;
  date: string;
  config: InterviewConfig;
  messages: Message[];
  evaluation?: Evaluation;
  completed: boolean;
}

export const SKILL_TYPES = [
  { value: 'coding', label: 'Coding/Technical', icon: 'Code' },
  { value: 'system_design', label: 'System Design', icon: 'Layout' },
  { value: 'behavioral', label: 'Behavioral/Soft Skills', icon: 'Users' },
  { value: 'dsa', label: 'Data Structures & Algorithms', icon: 'Database' },
  { value: 'tech_stack', label: 'Specific Tech Stack', icon: 'Layers' },
] as const;

export const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;