import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { vi, describe, it, expect, beforeAll, beforeEach } from 'vitest';
import questionRoutes from '../routes/questionRoutes';
import reportRoutes from '../routes/reportRoutes';
import submissionRoutes from '../routes/submissionRoutes';

const mockPrismaClient = vi.hoisted(() => ({
  question: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
  report: {
    findMany: vi.fn(),
  },
  submission: {
    findMany: vi.fn(),
    create: vi.fn().mockResolvedValue({
      id: 'submission1',
      totalScore: 3,
      maxScore: 3,
      answers: []
    }),
  },
  answer: {
    findMany: vi.fn(),
  },
}));

vi.mock('@prisma/client', () => {
  return {
    PrismaClient: vi.fn(() => mockPrismaClient),
  };
});

describe('API Routes Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api/questions', questionRoutes);
    app.use('/api/reports', reportRoutes);
    app.use('/api/submissions', submissionRoutes);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/questions', () => {
    it('should return questions', async () => {
      const mockQuestions = [
        {
          id: '1',
          text: 'Test question?',
          type: 'single',
          answers: [
            { id: '1', text: 'Answer 1', questionId: '1' },
            { id: '2', text: 'Answer 2', questionId: '1' },
          ],
        },
      ];

      mockPrismaClient.question.findMany.mockResolvedValue(mockQuestions);

      const response = await request(app).get('/api/questions');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockQuestions);
    });
  });

  describe('GET /api/reports', () => {
    it('should return reports', async () => {
      const mockSubmissions = [
        { id: 1, totalScore: 8, maxScore: 10, createdAt: new Date() },
        { id: 2, totalScore: 5, maxScore: 10, createdAt: new Date() },
      ];

      mockPrismaClient.submission.findMany.mockResolvedValue(mockSubmissions);

      const response = await request(app).get('/api/reports');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/submissions', () => {
    it('should handle quiz submission', async () => {
      const mockRequest = {
        answers: {
          '1': ['Answer 1'],
          '2': ['Answer 2', 'Answer 3']
        }
      };

      const mockQuestions = [
        {
          id: 1,
          text: 'Question 1',
          type: 'single',
          answers: [
            { id: 1, text: 'Answer 1', questionId: 1, points: 2, isCorrect: true },
            { id: 2, text: 'Wrong Answer', questionId: 1, points: 0, isCorrect: false },
          ],
        },
        {
          id: 2,
          text: 'Question 2',
          type: 'multiple',
          answers: [
            { id: 3, text: 'Answer 2', questionId: 2, points: 1, isCorrect: true },
            { id: 4, text: 'Answer 3', questionId: 2, points: 1, isCorrect: true },
          ],
        },
      ];

      mockPrismaClient.question.findMany.mockResolvedValue(mockQuestions);
      
      mockPrismaClient.answer.findMany
        .mockImplementation((params) => {
          const questionId = params.where.questionId;
          const texts = params.where.text.in;
          
          if (questionId === 1) {
            return mockQuestions[0].answers.filter(a => texts.includes(a.text));
          } else if (questionId === 2) {
            return mockQuestions[1].answers.filter(a => texts.includes(a.text));
          }
          return [];
        });

      const mockSubmissionResult = {
        id: 'submission1',
        totalScore: 4,
        maxScore: 4,
        answers: [],
      };

      mockPrismaClient.submission.create.mockResolvedValue({
        ...mockSubmissionResult,
        answers: {
          create: expect.anything(),
        },
      });

      const response = await request(app)
        .post('/api/submissions')
        .send(mockRequest);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('score');
      expect(response.body).toHaveProperty('totalScore');
    });
  });
}); 