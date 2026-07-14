import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { FaGraduationCap, FaEnvelope, FaLock } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { error } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      error(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-header">
          <FaGraduationCap className="login-logo" />
          <h1>EduManage Pro</h1>
          <p>School Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">

          <div className="form-group">
            <label><FaEnvelope /> Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@school.com"
              required
            />
          </div>

          <div className="form-group">
            <label><FaLock /> Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>

        </form>

        <div className="login-footer">
          <p>Demo Credentials:</p>
          <small>Admin: admin@school.com / admin123</small>
          <small>Teacher: teacher@school.com / teacher123</small>
        </div>

      </div>
    </div>
  );
};

export default Login;