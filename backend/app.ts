import express from 'express';
import cors from 'cors';
import questionRoutes from './routes/questionRoutes';
import submissionRoutes from './routes/submissionRoutes';
import reportRoutes from './routes/reportRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/questions', questionRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/report', reportRoutes);

export default app;
