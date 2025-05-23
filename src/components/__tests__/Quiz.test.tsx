import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Quiz from '../Quiz';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import quizReducer from '../../store/slices/quizSlice';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});


vi.mock('../../store/slices/quizSlice', () => ({
  __esModule: true,
  default: (state = {
    questions: [],
    loading: false,
    error: null,
  }, action: any) => state,
  fetchQuestions: () => ({ type: 'quiz/fetchQuestions' }),
  submitQuiz: (answers: any) => ({
    type: 'quiz/submitQuiz',
    payload: answers,
    async unwrap() {
      return {
        score: 80,
        totalScore: 8,
        maxPossiblePoints: 10,
      };
    },
  }),
}));

describe('Quiz Component', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        quiz: quizReducer,
      },
    });

    store.getState = vi.fn().mockReturnValue({
      quiz: {
        questions: [
          {
            id: '1',
            text: 'Test question 1?',
            type: 'single',
            answers: [
              { text: 'Answer 1' },
              { text: 'Answer 2' },
            ],
          },
          {
            id: '2',
            text: 'Test question 2?',
            type: 'multiple',
            answers: [
              { text: 'Option 1' },
              { text: 'Option 2' },
            ],
          },
        ],
        loading: false,
        error: null,
      },
    });
  });

  it('renders loading state correctly', () => {
    store.getState = vi.fn().mockReturnValue({
      quiz: {
        questions: [],
        loading: true,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Quiz />
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByText('Loading questions...')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    store.getState = vi.fn().mockReturnValue({
      quiz: {
        questions: [],
        loading: false,
        error: 'Failed to fetch questions',
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Quiz />
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByText('Failed to fetch questions')).toBeInTheDocument();
  });

  it('renders questions and allows selecting answers', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Quiz />
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByText(/Test question 1\?/)).toBeInTheDocument();
    expect(screen.getByText(/Test question 2\?/)).toBeInTheDocument();
    
    expect(screen.getByText('Answer 1')).toBeInTheDocument();
    expect(screen.getByText('Answer 2')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    
    fireEvent.click(screen.getByLabelText('Answer 1'));
    fireEvent.click(screen.getByLabelText('Option 1'));
    fireEvent.click(screen.getByLabelText('Option 2'));
    
    const submitButton = screen.getByText('Submit Quiz');
    expect(submitButton).not.toBeDisabled();
    
    fireEvent.click(submitButton);
    
    return waitFor(() => {
      expect(screen.getByText('Quiz Completed!')).toBeInTheDocument();
      expect(screen.getByText('Your Score: 80%')).toBeInTheDocument();
      expect(screen.getByText('You scored 8 out of 10 points')).toBeInTheDocument();
    });
  });
}); 