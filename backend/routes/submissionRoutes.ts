import { Router, RequestHandler } from 'express';
import { submitQuiz, getSubmissions } from '../controllers/submissionController';

const router = Router();

router.post('/', submitQuiz as RequestHandler);
router.get('/', getSubmissions as RequestHandler);

export default router;
