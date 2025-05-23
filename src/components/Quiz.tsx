import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { fetchQuestions, submitQuiz } from '../store/slices/quizSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';

const Quiz: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { questions, loading, error } = useSelector(
    (state: RootState) => state.quiz,
  );
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState<{
    score: number;
    totalScore: number;
    maxPossiblePoints: number;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  const handleAnswerSelect = (
    questionId: string,
    answer: string,
    isMultiple: boolean,
  ) => {
    setAnswers((prev) => {
      if (isMultiple) {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(answer)
          ? currentAnswers.filter((a) => a !== answer)
          : [...currentAnswers, answer];
        return {
          ...prev,
          [questionId]: newAnswers,
        };
      } else {
        return {
          ...prev,
          [questionId]: [answer],
        };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const result = await dispatch(submitQuiz(answers)).unwrap();
      setFinalScore({
        score: result.score,
        totalScore: result.totalScore,
        maxPossiblePoints: result.maxPossiblePoints,
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading questions...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!questions || questions.length === 0) {
    return <div className="alert alert-info">No questions available</div>;
  }

  if (isSubmitted && finalScore) {
    return (
      <div className="quiz-container p-4">
        <div className="card">
          <div className="card-body text-center">
            <h2 className="mb-4">Quiz Completed!</h2>
            <div className="score-display mb-4">
              <h3>Your Score: {finalScore.score}%</h3>
              <p className="text-muted">
                You scored {finalScore.totalScore} out of{' '}
                {finalScore.maxPossiblePoints} points
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/report')}
            >
              View Score Distribution
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container p-4">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Quiz Questions</h2>
          {questions.map((question, index) => {
            const isMultipleChoice = question.type === 'multiple';
            const currentAnswers = answers[question.id] || [];

            return (
              <div key={question.id} className="question-container mb-4">
                <h5 className="mb-3">
                  Question {index + 1}: {question.text}
          </h5>
          <div className="options-list">
                  {question.answers.map((answer, answerIndex) => (
                    <div key={answerIndex} className="form-check">
                <input
                  className="form-check-input"
                  type={isMultipleChoice ? 'checkbox' : 'radio'}
                  name={`question-${question.id}`}
                        id={`option-${question.id}-${answerIndex}`}
                  checked={currentAnswers.includes(answer.text)}
                  onChange={() =>
                    handleAnswerSelect(
                      question.id,
                      answer.text,
                      isMultipleChoice,
                    )
                  }
                />
                      <label
                        className="form-check-label"
                        htmlFor={`option-${question.id}-${answerIndex}`}
                      >
                  {answer.text}
                </label>
              </div>
            ))}
          </div>
              </div>
            );
          })}

          <div className="mt-4 d-flex justify-content-end">
              <button
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
              >
                Submit Quiz
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
