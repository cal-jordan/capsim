import { Request, Response } from 'express';
import { PrismaClient, Submission } from '@prisma/client';

const prisma = new PrismaClient();

export const getReport = async (req: Request, res: Response) => {
  const submissions = await prisma.submission.findMany();

  const ranges = Array.from({ length: 10 }, (_, i) => ({
    range: `${i * 10}%-${(i + 1) * 10}%`,
    count: 0,
  }));

  submissions.forEach((sub: Submission) => {
    const score = Math.min(Math.round((sub.totalScore / sub.maxScore) * 100), 100);
    const idx = Math.min(Math.floor(score / 10), 9);
    ranges[idx].count++;
  });

  res.json(ranges);
};
