import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './slices/quizSlice';
import reportReducer from './slices/reportSlice';
import type { QuizState } from '../types';
import type { ReportState } from '../types';

export interface RootState {
  quiz: QuizState;
  report: ReportState;
}

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    report: reportReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
