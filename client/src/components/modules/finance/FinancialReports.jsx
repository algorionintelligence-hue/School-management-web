import React, { useState, useEffect } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaChartLine, FaChartBar, FaChartPie, FaDownload,
  FaCalendarAlt, FaMoneyBillWave, FaArrowUp, FaArrowDown 
} from 'react-icons/fa';
import { Bar, Line, Pie } from 'react-chartjs-2';
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
import './FinancialReports.css';

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

const FinancialReports = () => {
  const { success } = useNotification();
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-12-31' });
  const [reportType, setReportType] = useState('revenue');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);

  const fetchReportData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Tuition Fees',
        data: [125000, 125000, 125000, 125000, 125000, 125000, 125000, 125000, 125000, 125000, 125000, 125000],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Examination Fees',
        data: [25000, 0, 0, 25000, 0, 0, 25000, 0, 0, 25000, 0, 0],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Other Fees',
        data: [15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  };

  const expenseData = {
    labels: ['Salaries', 'Utilities', 'Maintenance', 'Supplies', 'Transport', 'Events', 'Misc'],
    datasets: [{
      data: [450000, 45000, 30000, 25000, 35000, 20000, 15000],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(199, 199, 199, 0.6)'
      ]
    }]
  };

  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [165000, 140000, 140000, 165000, 140000, 140000, 165000, 140000, 140000, 165000, 140000, 140000],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Expenses',
        data: [120000, 115000, 130000, 125000, 110000, 135000, 120000, 110000, 125000, 130000, 115000, 140000],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const summaryStats = {
    totalRevenue: 1785000,
    totalExpenses: 1475000,
    netIncome: 310000,
    outstanding: 125000,
    collectionRate: 93.5
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaChartLine /> Financial Reports</h1>
        <div className="header-actions">
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="revenue">Revenue Report</option>
            <option value="expense">Expense Report</option>
            <option value="trend">Trend Analysis</option>
          </select>
          <button className="btn-primary" onClick={() => success('Report exported to PDF')}>
            <FaDownload /> Export
          </button>
        </div>
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
        </div>
      </div>

      <div className="financial-summary">
        <div className="summary-card revenue">
          <div className="card-icon"><FaArrowUp /></div>
          <div className="card-content">
            <h4>Total Revenue</h4>
            <span className="amount">${summaryStats.totalRevenue.toLocaleString()}</span>
          </div>
        </div>
        <div className="summary-card expense">
          <div className="card-icon"><FaArrowDown /></div>
          <div className="card-content">
            <h4>Total Expenses</h4>
            <span className="amount">${summaryStats.totalExpenses.toLocaleString()}</span>
          </div>
        </div>
        <div className="summary-card net">
          <div className="card-icon"><FaMoneyBillWave /></div>
          <div className="card-content">
            <h4>Net Income</h4>
            <span className="amount">${summaryStats.netIncome.toLocaleString()}</span>
          </div>
        </div>
        <div className="summary-card outstanding">
          <div className="card-icon"><FaCalendarAlt /></div>
          <div className="card-content">
            <h4>Outstanding</h4>
            <span className="amount">${summaryStats.outstanding.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {reportType === 'revenue' && (
          <div className="chart-card wide">
            <h3>Revenue Breakdown by Category</h3>
            <Bar data={revenueData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        )}
        {reportType === 'expense' && (
          <div className="chart-card wide">
            <h3>Expense Distribution</h3>
            <Pie data={expenseData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        )}
        {reportType === 'trend' && (
          <div className="chart-card wide">
            <h3>Revenue vs Expenses Trend</h3>
            <Line data={trendData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        )}
      </div>

      <div className="detailed-report">
        <h3>Collection Summary</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Fee Category</th>
              <th>Expected</th>
              <th>Collected</th>
              <th>Outstanding</th>
              <th>Collection %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tuition Fees</td>
              <td>$1,500,000</td>
              <td>$1,425,000</td>
              <td>$75,000</td>
              <td>
                <div className="progress-bar small">
                  <div className="progress-fill" style={{ width: '95%' }}></div>
                  <span>95%</span>
                </div>
              </td>
            </tr>
            <tr>
              <td>Examination Fees</td>
              <td>$100,000</td>
              <td>$90,000</td>
              <td>$10,000</td>
              <td>
                <div className="progress-bar small">
                  <div className="progress-fill" style={{ width: '90%' }}></div>
                  <span>90%</span>
                </div>
              </td>
            </tr>
            <tr>
              <td>Transportation</td>
              <td>$180,000</td>
              <td>$162,000</td>
              <td>$18,000</td>
              <td>
                <div className="progress-bar small">
                  <div className="progress-fill" style={{ width: '90%' }}></div>
                  <span>90%</span>
                </div>
              </td>
            </tr>
            <tr>
              <td>Library & Lab</td>
              <td>$60,000</td>
              <td>$58,000</td>
              <td>$2,000</td>
              <td>
                <div className="progress-bar small">
                  <div className="progress-fill" style={{ width: '96.7%' }}></div>
                  <span>96.7%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialReports;