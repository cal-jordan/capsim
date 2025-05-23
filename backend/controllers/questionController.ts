import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getQuestions = async (req: Request, res: Response) => {
  const questions = await prisma.question.findMany({
    include: { answers: true },
  });
  res.json(questions);
};

export const createQuestion = async (req: Request, res: Response) => {
  const { text, type, answers } = req.body;
  const question = await prisma.question.create({
    data: { text, type, answers: { create: answers } },
    include: { answers: true },
  });
  res.json(question);
};
