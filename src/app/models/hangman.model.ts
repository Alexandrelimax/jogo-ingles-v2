export interface HangmanWord {
  id: string;
  word: string;
  category: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
