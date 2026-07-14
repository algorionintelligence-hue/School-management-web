import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  FaUsers, FaChalkboardTeacher, FaUserGraduate, FaMoneyBillWave,
  FaCalendarCheck, FaBell, FaChartLine, FaArrowUp, FaArrowDown,
  FaExclamationTriangle, FaCheckCircle, FaClock 
} from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setLoading(true);
    setTimeout(() => {
      setStats({
        totalStudents: 1250,
        totalStaff: 85,
        totalTeachers: 45,
        monthlyRevenue: 185000,
        attendanceRate: 94.5,
        pendingFees: 45000,
        newAdmissions: 45,
        upcomingEvents: 3
      });
      setRecentActivities([
        { id: 1, type: 'student', message: 'New student enrolled: Alice Johnson', time: '10 min ago', icon: FaUserGraduate },
        { id: 2, type: 'fee', message: 'Fee payment received: $2,500 from David Brown', time: '25 min ago', icon: FaMoneyBillWave },
        { id: 3, type: 'attendance', message: 'Daily attendance marked for Class 10-A', time: '1 hour ago', icon: FaCalendarCheck },
        { id: 4, type: 'alert', message: 'Emergency alert sent: Weather warning', time: '2 hours ago', icon: FaExclamationTriangle },
        { id: 5, type: 'exam', message: 'Mid-term exam schedule published', time: '3 hours ago', icon: FaCheckCircle }
      ]);
      setLoading(false);
    }, 800);
  };

  const admissionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'New Admissions',
      data: [12, 19, 15, 25, 22, 30],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const revenueData = {
    labels: ['Tuition', 'Exam', 'Transport', 'Library', 'Sports', 'Misc'],
    datasets: [{
      data: [125000, 25000, 18000, 5000, 8000, 4000],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)'
      ]
    }]
  };

  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Present',
        data: [1180, 1190, 1175, 1200, 1185, 950],
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      },
      {
        label: 'Absent',
        data: [70, 60, 75, 50, 65, 50],
        backgroundColor: 'rgba(255, 99, 132, 0.6)'
      }
    ]
  };

  if (loading) return <div className="loading-spinner">Loading dashboard...</div>;

  return (
    <div className="module-container dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's what's happening at your school today.</p>
        </div>
        <div className="date-display">
          <FaClock /> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card students" onClick={() => navigate('/students')}>
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-content">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
            <span className="trend up"><FaArrowUp /> +12 this month</span>
          </div>
        </div>
        <div className="stat-card staff" onClick={() => navigate('/staff')}>
          <div className="stat-icon"><FaChalkboardTeacher /></div>
          <div className="stat-content">
            <h3>{stats.totalStaff}</h3>
            <p>Total Staff</p>
            <span className="trend up"><FaArrowUp /> +3 this month</span>
          </div>
        </div>
        <div className="stat-card revenue" onClick={() => navigate('/finance/reports')}>
          <div className="stat-icon"><FaMoneyBillWave /></div>
          <div className="stat-content">
            <h3>${stats.monthlyRevenue.toLocaleString()}</h3>
            <p>Monthly Revenue</p>
            <span className="trend up"><FaArrowUp /> 8.5% vs last month</span>
          </div>
        </div>
        <div className="stat-card attendance" onClick={() => navigate('/attendance/analytics')}>
          <div className="stat-icon"><FaCalendarCheck /></div>
          <div className="stat-content">
            <h3>{stats.attendanceRate}%</h3>
            <p>Attendance Rate</p>
            <span className="trend down"><FaArrowDown /> -1.2% vs yesterday</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3><FaChartLine /> Admissions Trend</h3>
          <Line data={admissionData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="dashboard-card">
          <h3><FaMoneyBillWave /> Revenue Distribution</h3>
          <Doughnut data={revenueData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="dashboard-card wide">
          <h3><FaCalendarCheck /> Weekly Attendance</h3>
          <Bar data={attendanceData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="dashboard-card activities">
          <h3><FaBell /> Recent Activities</h3>
          <div className="activities-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className={`activity-item ${activity.type}`}>
                <div className="activity-icon">
                  <activity.icon />
                </div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card quick-links">
          <h3>Quick Actions</h3>
          <div className="quick-links-grid">
            <button onClick={() => navigate('/students/enrollment')} className="quick-link">
              <FaUserGraduate /> New Admission
            </button>
            <button onClick={() => navigate('/attendance/students')} className="quick-link">
              <FaCalendarCheck /> Mark Attendance
            </button>
            <button onClick={() => navigate('/exams/marks')} className="quick-link">
              <FaCheckCircle /> Enter Marks
            </button>
            <button onClick={() => navigate('/finance/invoices')} className="quick-link">
              <FaMoneyBillWave /> Generate Invoice
            </button>
            <button onClick={() => navigate('/communication/announcements')} className="quick-link">
              <FaBell /> Post Announcement
            </button>
            <button onClick={() => navigate('/communication/alerts')} className="quick-link">
              <FaExclamationTriangle /> Send Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;