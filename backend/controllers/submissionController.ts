import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface QuizSubmission {
  [questionId: string]: string[];
}

interface SubmissionData {
  id: number;
  totalScore: number;
  maxScore: number;
  createdAt: Date;
}

export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        totalScore: true,
        maxScore: true,
        createdAt: true,
      },
    });

    const reports = submissions.map((submission: SubmissionData) => ({
      id: submission.id.toString(),
      score: Math.round((submission.totalScore / submission.maxScore) * 100),
      submittedAt: submission.createdAt.toISOString(),
    }));

    res.json(reports);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const { answers } = req.body as { answers: QuizSubmission };

    const questionIds = Object.keys(answers)
      .map(id => parseInt(id))
      .filter(id => !isNaN(id));

    if (questionIds.length === 0) {
      return res.status(400).json({
        error: 'Invalid submission',
        details: 'No valid question IDs provided',
      });
    }

    const questions = await prisma.question.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
      include: {
        answers: true,
      },
    });

    if (questions.length === 0) {
      return res.status(404).json({
        error: 'Questions not found',
        details: 'No questions found for the provided IDs',
      });
    }

    const maxPossiblePoints = questions.reduce((total, question) => {
      if (question.type === 'single') {
        return total + Math.max(...question.answers.map(a => a.points));
      } else {
        return (
          total +
          question.answers.reduce((sum, answer) => sum + (answer.points > 0 ? answer.points : 0), 0)
        );
      }
    }, 0);

    let totalScore = 0;

    for (const [questionId, selectedAnswers] of Object.entries(answers)) {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (!question) continue;

      if (question.type === 'single') {
        const selectedAnswer = question.answers.find(a => a.text === selectedAnswers[0]);
      if (selectedAnswer) {
        totalScore += selectedAnswer.points;
        }
      }
      else if (question.type === 'multiple') {
        for (const answerText of selectedAnswers) {
          const selectedAnswer = question.answers.find(a => a.text === answerText);
          if (selectedAnswer) {
            totalScore += selectedAnswer.points;
          }
        }
      }
    }

    const percentageScore = Math.min(Math.round((totalScore / maxPossiblePoints) * 100), 100);

    const submission = await prisma.submission.create({
      data: {
        totalScore,
        maxScore: maxPossiblePoints,
        answers: {
          create: (
            await Promise.all(
            Object.entries(answers).flatMap(async ([questionId, selectedAnswers]) => {
              const answerRecords = await prisma.answer.findMany({
                where: {
                  questionId: parseInt(questionId),
                    text: { in: selectedAnswers },
                  },
              });

                return answerRecords.map(answerRecord => ({
                question: {
                  connect: {
                      id: parseInt(questionId),
                    },
                },
                answer: {
                  connect: {
                      id: answerRecord.id,
                    },
                  },
                }));
              }),
            )
          ).flat(),
        },
      },
      include: {
        answers: {
          include: {
            answer: true,
            question: true,
          },
        },
      },
    });

    res.json({
      submission,
      score: percentageScore,
      totalScore,
      maxPossiblePoints,
    });
  } catch (error) {
    console.error('Failed to submit quiz:', error);
    res.status(500).json({ 
      error: 'Failed to submit quiz',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
