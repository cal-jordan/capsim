export interface Answer {
  text: string;
  points: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple';
  answers: Answer[];
}

export interface AnswerInput {
  text: string;
  points: number;
}

export interface QuestionInput {
  text: string;
  type: 'single' | 'multiple';
  answers: AnswerInput[];
}

export interface Report {
  range: string;
  count: number;
}

export interface QuizState {
  questions: Question[];
  loading: boolean;
  error: string | null;
}

export interface ReportState {
  reports: Report[];
  loading: boolean;
  error: string | null;
}

export interface QuizSubmission {
  answers: Record<string, string[]>;
}
