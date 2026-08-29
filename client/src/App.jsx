import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import ProtectedRoute from './components/modules/auth/ProtectedRoute';
import Layout from './components/layout/layout';
import Login from './components/modules/auth/Login';
import Dashboard from './components/modules/dashboard/Dashboard';

import StudentList from './components/modules/sis/StudentList';
import StudentProfile from './components/modules/sis/StudentProfile';
import StudentEnrollment from './components/modules/sis/StudentEnrollment';

import StaffList from './components/modules/staff/StaffList';
import StaffProfile from './components/modules/staff/StaffProfile';
import SubstituteAllocation from './components/modules/staff/SubstituteAllocation';

import ClassConfig from './components/modules/academic/ClassConfig';
import SubjectAssignment from './components/modules/academic/SubjectAssignment';
import Timetable from './components/modules/academic/Timetable';
import Syllabus from './components/modules/academic/Syllabus';

import ExamSchedule from './components/modules/examination/ExamSchedule';
import MarksEntry from './components/modules/examination/MarksEntry';
import ReportCards from './components/modules/examination/ReportCards';
import Transcripts from './components/modules/examination/Transcripts';

import StudentAttendance from './components/modules/attendance/StudentAttendance';
import StaffAttendance from './components/modules/attendance/StaffAttendance';
import AttendanceAnalytics from './components/modules/attendance/AttendanceAnalytics';

import FeeStructure from './components/modules/finance/FeeStructure';
import InvoiceGeneration from './components/modules/finance/InvoiceGeneration';
import PaymentTracking from './components/modules/finance/PaymentTracking';
import FinancialReports from './components/modules/finance/FinancialReports';

import Announcements from './components/modules/communication/Announcements';
import Messaging from './components/modules/communication/Messaging';
import EmergencyAlerts from './components/modules/communication/EmergencyAlerts';

import UserManagement from './components/modules/auth/UserManagement';
import RolesPermissions from './components/modules/auth/RolesPermissions';

import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="students" element={<StudentList />} />
                <Route path="students/:id" element={<StudentProfile />} />
                <Route path="students/enrollment" element={<StudentEnrollment />} />
                <Route path="staff" element={<StaffList />} />
                <Route path="staff/:id" element={<StaffProfile />} />
                <Route path="staff/substitutes" element={<SubstituteAllocation />} />
                <Route path="academic/classes" element={<ClassConfig />} />
                <Route path="academic/subjects" element={<SubjectAssignment />} />
                <Route path="academic/timetable" element={<Timetable />} />
                <Route path="academic/syllabus" element={<Syllabus />} />
                <Route path="exams/schedule" element={<ExamSchedule />} />
                <Route path="exams/marks" element={<MarksEntry />} />
                <Route path="exams/reports" element={<ReportCards />} />
                <Route path="exams/transcripts" element={<Transcripts />} />
                <Route path="attendance/students" element={<StudentAttendance />} />
                <Route path="attendance/staff" element={<StaffAttendance />} />
                <Route path="attendance/analytics" element={<AttendanceAnalytics />} />
                <Route path="finance/fees" element={<FeeStructure />} />
                <Route path="finance/invoices" element={<InvoiceGeneration />} />
                <Route path="finance/payments" element={<PaymentTracking />} />
                <Route path="finance/reports" element={<FinancialReports />} />
                <Route path="communication/announcements" element={<Announcements />} />
                <Route path="communication/messages" element={<Messaging />} />
                <Route path="communication/alerts" element={<EmergencyAlerts />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="users/roles" element={<RolesPermissions />} />
              </Route>
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;