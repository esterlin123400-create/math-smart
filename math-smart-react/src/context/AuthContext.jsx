import React, { createContext, useContext, useState } from 'react';
import { mockUserData } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState('student'); // 'student' | 'teacher' | 'supervisor' | 'guest'
  const [user, setUser] = useState(mockUserData.student);

  const loginAs = (newRole) => {
    setRole(newRole);
    if (newRole === 'student') {
      setUser(mockUserData.student);
    } else if (newRole === 'teacher' || newRole === 'supervisor') {
      setUser(mockUserData.teacher);
    } else {
      setUser({
        name: 'زائر المنصة',
        role: 'guest',
        avatar: '/assets/avatar_robot.svg'
      });
    }
  };

  const logout = () => {
    setRole('guest');
    setUser({
      name: 'زائر',
      role: 'guest',
      avatar: '/assets/avatar_robot.svg'
    });
  };

  const updateProfile = (fields) => {
    setUser(prev => ({ ...prev, ...fields }));
  };

  return (
    <AuthContext.Provider value={{ role, user, loginAs, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
