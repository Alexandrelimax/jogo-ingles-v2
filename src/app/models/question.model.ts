export type QuestionType = 'multiple_choice' | 'typing' | 'listening';

export type QuestionCategory =
  | 'modal_verbs'
  | 'relative_pronouns'
  | 'question_words'
  | 'past_tense'
  | 'present_perfect'
  | 'conditionals'
  | 'vocabulary'
  | 'phrasal_verbs';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export interface Question {
  id: string;
  type: QuestionType;
  category: QuestionCategory;
  topic: string;
  difficulty: DifficultyLevel;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  xp?: number;
  timeLimit?: number;
}

export interface HighScore {
  score: number;
  level: number;
  accuracy: number;
  streak: number;
  date: string;
  mode?: string;
}

export type FeedbackState = 'correct' | 'wrong' | 'timeout' | null;
export type AppScreen = 'home' | 'mode-select' | 'game-intro' | 'game' | 'gameover' | 'hangman';
