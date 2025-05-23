export type QuestionType = 'single' | 'multiple';

export interface Answer {
  text: string;
  points: number;
}

export interface Question {
  id: number;
  text: string;
  type: 'single' | 'multiple';
  answers: Answer[];
}

export interface QuizSubmission {
  questionId: number;
  selectedAnswers: string[];
}

export interface ScoreRange {
  range: string;
  count: number;
}
