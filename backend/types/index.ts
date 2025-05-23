export interface AnswerInput {
  text: string;
  points: number;
}

export interface QuestionInput {
  text: string;
  type: 'single' | 'multiple';
  answers: AnswerInput[];
}
