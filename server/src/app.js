import express from 'express';
import cors from 'cors';
import { errorMiddleware, notFoundMiddleware } from './common/middleware/error.middleware.js';

// Import routes
import schoolRoutes from './modules/school/school.routes.js';
import teacherRoutes from './modules/teacher/teacher.routes.js';
import studentRoutes from './modules/student/student.routes.js';
import authRoutes from './modules/auth/auth.routes.js';

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