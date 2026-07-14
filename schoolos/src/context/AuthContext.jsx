import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('sms_user');
    const storedPerms = localStorage.getItem('sms_permissions');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setPermissions(storedPerms ? JSON.parse(storedPerms) : []);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, mfaCode = null) => {
    try {
      // API call simulation
      const response = await mockLoginAPI(email, password, mfaCode);
      if (response.success) {
        setUser(response.user);
        setPermissions(response.permissions);
        localStorage.setItem('sms_user', JSON.stringify(response.user));
        localStorage.setItem('sms_permissions', JSON.stringify(response.permissions));
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setPermissions([]);
    localStorage.removeItem('sms_user');
    localStorage.removeItem('sms_permissions');
  };

  const hasPermission = (module, action) => {
    return permissions.some(p => 
      p.module === module && (p.actions.includes(action) || p.actions.includes('*'))
    );
  };

  const mockLoginAPI = (email, password, mfaCode) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'admin@school.com' && password === 'admin123') {
          if (!mfaCode) {
            resolve({ success: false, requiresMFA: true });
            return;
          }
          if (mfaCode !== '123456') {
            resolve({ success: false, error: 'Invalid MFA code' });
            return;
          }
          resolve({
            success: true,
            user: {
              id: 1,
              email: 'admin@school.com',
              name: 'System Administrator',
              role: 'admin',
              avatar: null
            },
            permissions: [
              { module: '*', actions: ['*'] }
            ]
          });
        } else if (email === 'teacher@school.com' && password === 'teacher123') {
          resolve({
            success: true,
            user: {
              id: 2,
              email: 'teacher@school.com',
              name: 'John Teacher',
              role: 'teacher',
              avatar: null
            },
            permissions: [
              { module: 'academic', actions: ['read', 'write'] },
              { module: 'attendance', actions: ['read', 'write'] },
              { module: 'examination', actions: ['read', 'write'] },
              { module: 'communication', actions: ['read', 'write'] }
            ]
          });
        } else {
          resolve({ success: false, error: 'Invalid credentials' });
        }
      }, 1000);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};