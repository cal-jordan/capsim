import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.submissionAnswer.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();


  await prisma.question.create({
    data: {
      text: "What's the first thing you should do when you need motivation?",
      type: 'single',
      answers: {
        create: [
          { text: 'Read a book', points: 5 },
          { text: 'Watch social media', points: 0 },
          { text: 'Go to the gym', points: 3 },
          { text: 'Run in the park', points: 7 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: 'When was Capsim Founded?',
      type: 'single',
      answers: {
        create: [
          { text: 'August 2010', points: 0 },
          { text: 'April 1990', points: 0 },
          { text: 'December 2000', points: 0 },
          { text: 'January 1985', points: 1 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: 'Which of the following are Capsim products?',
      type: 'multiple',
      answers: {
        create: [
          { text: 'CapsimInbox', points: 1 },
          { text: 'ModXM', points: 1 },
          { text: 'CapsimOutbox', points: 0 },
          { text: 'CompXM', points: 1 },
        ],
      },
    },
  });

  console.log('Database has been seeded with sample quiz data. 🌱');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
