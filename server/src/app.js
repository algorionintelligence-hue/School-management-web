import express from 'express';
import cors from 'cors';
import { errorMiddleware, notFoundMiddleware } from './common/middleware/error.middleware.js';

// Import routes
import schoolRoutes from './modules/school/school.routes.js';
import teacherRoutes from './modules/teacher/teacher.routes.js';
import studentRoutes from './modules/student/student.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import classRoutes from './modules/academic/class/class.routes.js';
import classSubjectRoutes from './modules/academic/class/class-subject.routes.js';
import streamRoutes from './modules/academic/stream/stream.routes.js';
import subjectRoutes from './modules/academic/subject/subject.routes.js';
import teacherSubjectRoutes from './modules/academic/subject/teacher-subject.routes.js';
import timetableRoutes from './modules/academic/timetable/timetable-entry.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/schools', schoolRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/teachers', teacherRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/class-subjects', classSubjectRoutes);
app.use('/api/v1/streams', streamRoutes);
app.use('/api/v1/subjects', subjectRoutes);
app.use('/api/v1/teacher-subjects', teacherSubjectRoutes);
app.use('/api/v1/timetables', timetableRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;