import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { Question, QuizState } from '../../types';

const initialState: QuizState = {
  questions: [],
  loading: false,
  error: null,
};

export const fetchQuestions = createAsyncThunk<Question[]>(
  'quiz/fetchQuestions',
  async () => {
    const response = await api.get('/api/questions');
    return response.data;
  },
);

export const submitQuiz = createAsyncThunk(
  'quiz/submitQuiz',
  async (answers: Record<string, string[]>) => {
    const response = await api.post('/api/submissions', { answers });
    return response.data;
  },
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch questions';
      });
  },
});

export default quizSlice.reducer;
