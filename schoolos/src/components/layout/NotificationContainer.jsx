import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

const iconMap = {
  success: FaCheckCircle,
  error: FaTimesCircle,
  warning: FaExclamationTriangle,
  info: FaInfoCircle
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map(notification => {
        const Icon = iconMap[notification.type];
        return (
          <div key={notification.id} className={`notification ${notification.type}`}>
            <Icon className="notification-icon" />
            <span>{notification.message}</span>
            <button onClick={() => removeNotification(notification.id)}>
              <FaTimes />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationContainer;