import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUsers, FaChalkboardTeacher, FaBook, FaClipboardList, 
  FaCalendarCheck, FaMoneyBillWave, FaBullhorn, FaUserShield,
  FaTachometerAlt, FaChevronDown, FaChevronRight, FaGraduationCap
} from 'react-icons/fa';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt, module: 'dashboard' },
  {
    label: 'Student Information',
    icon: FaUsers,
    module: 'sis',
    children: [
      { path: '/students', label: 'All Students' },
      { path: '/students/enrollment', label: 'Enrollment' }
    ]
  },
  {
    label: 'Staff & Faculty',
    icon: FaChalkboardTeacher,
    module: 'staff',
    children: [
      { path: '/staff', label: 'All Staff' },
      { path: '/staff/substitutes', label: 'Substitutes' }
    ]
  },
  {
    label: 'Academic',
    icon: FaBook,
    module: 'academic',
    children: [
      { path: '/academic/classes', label: 'Classes & Sections' },
      { path: '/academic/subjects', label: 'Subjects' },
      { path: '/academic/timetable', label: 'Timetable' },
      { path: '/academic/syllabus', label: 'Syllabus' }
    ]
  },
  {
    label: 'Examination',
    icon: FaClipboardList,
    module: 'examination',
    children: [
      { path: '/exams/schedule', label: 'Exam Schedule' },
      { path: '/exams/marks', label: 'Marks Entry' },
      { path: '/exams/reports', label: 'Report Cards' },
      { path: '/exams/transcripts', label: 'Transcripts' }
    ]
  },
  {
    label: 'Attendance',
    icon: FaCalendarCheck,
    module: 'attendance',
    children: [
      { path: '/attendance/students', label: 'Student Attendance' },
      { path: '/attendance/staff', label: 'Staff Attendance' },
      { path: '/attendance/analytics', label: 'Analytics' }
    ]
  },
  {
    label: 'Finance',
    icon: FaMoneyBillWave,
    module: 'finance',
    children: [
      { path: '/finance/fees', label: 'Fee Structure' },
      { path: '/finance/invoices', label: 'Invoices' },
      { path: '/finance/payments', label: 'Payments' },
      { path: '/finance/reports', label: 'Reports' }
    ]
  },
  {
    label: 'Communication',
    icon: FaBullhorn,
    module: 'communication',
    children: [
      { path: '/communication/announcements', label: 'Announcements' },
      { path: '/communication/messages', label: 'Messages' },
      { path: '/communication/alerts', label: 'Emergency Alerts' }
    ]
  },
  {
    label: 'User Management',
    icon: FaUserShield,
    module: 'users',
    children: [
      { path: '/users', label: 'Users' },
      { path: '/users/roles', label: 'Roles & Permissions' }
    ]
  }
];

const Sidebar = ({ isOpen, onLinkClick }) => {
  const { hasPermission } = useAuth();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(() => {
    const saved = localStorage.getItem('sms_expanded_menus');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleMenu = (label) => {
    setExpandedMenus(prev => {
      const updated = { ...prev, [label]: !prev[label] };
      localStorage.setItem('sms_expanded_menus', JSON.stringify(updated));
      return updated;
    });
  };

  const filterMenuByPermission = (items) => {
    return items.filter(item => {
      if (item.children) {
        const filteredChildren = item.children.filter(child => 
          hasPermission(item.module, 'read')
        );
        return filteredChildren.length > 0;
      }
      return hasPermission(item.module, 'read');
    });
  };

  const visibleMenuItems = filterMenuByPermission(menuItems);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <FaGraduationCap className="logo-icon" />
        {isOpen && <h2>EduManage Pro</h2>}
      </div>
      
      <nav className="sidebar-nav">
        {visibleMenuItems.map((item) => (
          <div key={item.label} className="nav-item">
            {item.children ? (
              <>
                <button 
                  className="nav-link parent"
                  onClick={() => toggleMenu(item.label)}
                >
                  <item.icon className="nav-icon" />
                  {isOpen && (
                    <>
                      <span>{item.label}</span>
                      {expandedMenus[item.label] ? <FaChevronDown /> : <FaChevronRight />}
                    </>
                  )}
                </button>
                {(isOpen || true) && expandedMenus[item.label] && (
                  <div className="submenu">
                    {item.children.map(child => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        onClick={onLinkClick}
                        className={({ isActive }) => 
                          `submenu-link ${isActive ? 'active' : ''}`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.path}
                onClick={onLinkClick}
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <item.icon className="nav-icon" />
                {isOpen && <span>{item.label}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;