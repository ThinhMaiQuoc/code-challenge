import express from 'express';
import resourceRouter from './routes/resource';
import errorHandler from './utils/errorHandler';

const app = express();
app.use(express.json());

app.use('/api/resources', resourceRouter);

app.use(errorHandler);

export default app;