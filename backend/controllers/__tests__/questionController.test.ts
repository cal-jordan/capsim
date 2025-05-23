import { Request, Response } from 'express';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as questionController from '../questionController';

const mockPrismaClient = vi.hoisted(() => ({
  question: {
    findMany: vi.fn(),
    create: vi.fn(),
  }
}));

vi.mock('@prisma/client', () => {
  return {
    PrismaClient: vi.fn(() => mockPrismaClient),
  };
});

describe('Question Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  describe('getQuestions', () => {
    it('should return all questions with their answers', async () => {
      const mockQuestions = [
        {
          id: '1',
          text: 'Question 1',
          type: 'single',
          answers: [
            { id: '1', text: 'Answer 1', questionId: '1' },
            { id: '2', text: 'Answer 2', questionId: '1' },
          ],
        },
      ];

      mockPrismaClient.question.findMany.mockResolvedValue(mockQuestions);

      await questionController.getQuestions(mockReq as Request, mockRes as Response);

      expect(mockPrismaClient.question.findMany).toHaveBeenCalledWith({
        include: { answers: true },
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockQuestions);
    });
  });

  describe('createQuestion', () => {
    it('should create a new question with answers', async () => {
      const mockRequestBody = {
        text: 'New Question',
        type: 'multiple',
        answers: [
          { text: 'Answer Option 1' },
          { text: 'Answer Option 2' },
        ],
      };

      const mockCreatedQuestion = {
        id: '123',
        ...mockRequestBody,
        answers: [
          { id: '1', text: 'Answer Option 1', questionId: '123' },
          { id: '2', text: 'Answer Option 2', questionId: '123' },
        ],
      };

      mockReq.body = mockRequestBody;
      mockPrismaClient.question.create.mockResolvedValue(mockCreatedQuestion);

      await questionController.createQuestion(mockReq as Request, mockRes as Response);

      expect(mockPrismaClient.question.create).toHaveBeenCalledWith({
        data: {
          text: mockRequestBody.text,
          type: mockRequestBody.type,
          answers: { create: mockRequestBody.answers },
        },
        include: { answers: true },
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockCreatedQuestion);
    });
  });
}); 