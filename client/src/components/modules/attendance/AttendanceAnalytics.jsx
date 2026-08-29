import React, { useState, useEffect } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaChartBar, FaChartPie, FaChartLine, FaDownload,
  FaCalendarAlt, FaUserCheck, FaUserTimes 
} from 'react-icons/fa';
import { Bar, Pie, Line } from 'react-chartjs-2';
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
import './AttendanceAnalytics.css';

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

const AttendanceAnalytics = () => {
  const { success } = useNotification();
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-01-31' });
  const [selectedClass, setSelectedClass] = useState('all');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, selectedClass]);

  const fetchAnalytics = () => {
    setLoading(true);
    setTimeout(() => {
      setAnalytics({
        daily: [
          { date: '2024-01-01', present: 180, absent: 15, late: 5 },
          { date: '2024-01-02', present: 185, absent: 10, late: 5 },
          { date: '2024-01-03', present: 178, absent: 18, late: 4 },
          { date: '2024-01-04', present: 190, absent: 8, late: 2 },
          { date: '2024-01-05', present: 182, absent: 14, late: 4 },
          { date: '2024-01-08', present: 188, absent: 10, late: 2 },
          { date: '2024-01-09', present: 175, absent: 20, late: 5 }
        ],
        byClass: [
          { class: '9A', present: 38, absent: 2, percentage: 95 },
          { class: '9B', present: 36, absent: 4, percentage: 90 },
          { class: '10A', present: 40, absent: 0, percentage: 100 },
          { class: '10B', present: 37, absent: 3, percentage: 92.5 },
          { class: '11A', present: 28, absent: 2, percentage: 93.3 },
          { class: '11B', present: 25, absent: 5, percentage: 83.3 }
        ],
        topAbsentees: [
          { name: 'David Brown', rollNumber: '104', absences: 8, percentage: 60 },
          { name: 'Fiona Green', rollNumber: '105', absences: 6, percentage: 70 },
          { name: 'George Hall', rollNumber: '106', absences: 5, percentage: 75 }
        ],
        monthlyTrend: [
          { month: 'Aug', percentage: 92 },
          { month: 'Sep', percentage: 94 },
          { month: 'Oct', percentage: 91 },
          { month: 'Nov', percentage: 93 },
          { month: 'Dec', percentage: 89 },
          { month: 'Jan', percentage: 95 }
        ]
      });
      setLoading(false);
    }, 800);
  };

  const dailyChartData = {
    labels: analytics?.daily.map(d => d.date) || [],
    datasets: [
      {
        label: 'Present',
        data: analytics?.daily.map(d => d.present) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Absent',
        data: analytics?.daily.map(d => d.absent) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Late',
        data: analytics?.daily.map(d => d.late) || [],
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }
    ]
  };

  const classChartData = {
    labels: analytics?.byClass.map(c => c.class) || [],
    datasets: [{
      label: 'Attendance %',
      data: analytics?.byClass.map(c => c.percentage) || [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)'
      ],
      borderWidth: 1
    }]
  };

  const trendChartData = {
    labels: analytics?.monthlyTrend.map(m => m.month) || [],
    datasets: [{
      label: 'Monthly Attendance %',
      data: analytics?.monthlyTrend.map(m => m.percentage) || [],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const overallStats = {
    avgAttendance: analytics ? (analytics.daily.reduce((a, d) => a + (d.present / (d.present + d.absent + d.late)) * 100, 0) / analytics.daily.length).toFixed(1) : 0,
    totalStudents: 200,
    totalPresent: analytics ? analytics.daily.reduce((a, d) => a + d.present, 0) : 0,
    totalAbsent: analytics ? analytics.daily.reduce((a, d) => a + d.absent, 0) : 0
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaChartBar /> Attendance Analytics</h1>
        <button className="btn-primary" onClick={() => success('Report downloaded')}>
          <FaDownload /> Export Report
        </button>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <input 
            type="date" 
            value={dateRange.from}
            onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
          />
          <span>to</span>
          <input 
            type="date" 
            value={dateRange.to}
            onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
          />
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="all">All Classes</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
            <option value="11">Class 11</option>
          </select>
        </div>
      </div>

      <div className="analytics-stats">
        <div className="stat-card">
          <h4>Average Attendance</h4>
          <span className="stat-value">{overallStats.avgAttendance}%</span>
        </div>
        <div className="stat-card">
          <h4>Total Students</h4>
          <span className="stat-value">{overallStats.totalStudents}</span>
        </div>
        <div className="stat-card present">
          <h4>Total Present</h4>
          <span className="stat-value">{overallStats.totalPresent}</span>
        </div>
        <div className="stat-card absent">
          <h4>Total Absent</h4>
          <span className="stat-value">{overallStats.totalAbsent}</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Daily Attendance</h3>
          <Bar data={dailyChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="chart-card">
          <h3>Attendance by Class</h3>
          <Pie data={classChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="chart-card wide">
          <h3>Monthly Trend</h3>
          <Line data={trendChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="top-absentees">
        <h3><FaUserTimes /> Top Absentees</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Absences</th>
              <th>Attendance %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {analytics?.topAbsentees.map((student, idx) => (
              <tr key={idx}>
                <td>{student.rollNumber}</td>
                <td>{student.name}</td>
                <td>{student.absences}</td>
                <td>
                  <div className="progress-bar small">
                    <div className="progress-fill danger" style={{ width: `${student.percentage}%` }}></div>
                    <span>{student.percentage}%</span>
                  </div>
                </td>
                <td><span className="status-badge warning">At Risk</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceAnalytics;