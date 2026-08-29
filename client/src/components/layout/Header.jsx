import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import { FaBars, FaBell, FaMoon, FaSun, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications } = useNotification();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="header">
      <button className="menu-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>
      
      <div className="header-actions">
        <button className="icon-btn" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        
        <div className="notification-wrapper">
          <button 
            className="icon-btn notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <h4>Notifications</h4>
              {notifications.length === 0 ? (
                <p className="no-notifications">No new notifications</p>
              ) : (
                notifications.slice(0, 5).map(n => (
                  <div key={n.id} className={`notification-item ${n.type}`}>
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="profile-wrapper">
          <button 
            className="profile-btn"
            onClick={() => setShowProfile(!showProfile)}
          >
            <FaUserCircle />
            <span>{user?.name}</span>
          </button>
          
          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <strong>{user?.name}</strong>
                <span>{user?.email}</span>
                <span className="role-badge">{user?.role}</span>
              </div>
              <button onClick={logout} className="logout-btn">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;