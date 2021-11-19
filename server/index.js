import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import platformRoutes from './routes/platform.js'
import quizRoutes from './routes/quiz.js'
import submissionRoutes from './routes/submission.js'
import awardRoutes from './routes/award.js'

import { updateLeaderboardsJob, duplicateDB } from './schedule.js'

dotenv.config()

import { MONGO_URI } from './config.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true}));
app.use(cors({ 
    origin: ["http://localhost:3000", "https://quizz-it.netlify.app"],
    credentials: true }));
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Hello World!')
})


mongoose.connect(MONGO_URI, {useNewURLParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch(error => console.log(error.message));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/submissions',submissionRoutes)
app.use('/api/quizzes', quizRoutes);
app.use('/api/awards', awardRoutes);

// updateLeaderboardsJob.stop()

//duplicateDB()