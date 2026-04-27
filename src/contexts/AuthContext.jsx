import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login, logout, register } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    console.log('Utilisateur courant au chargement:', currentUser);
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleLogin = (email, password) => {
    console.log('AuthProvider - Tentative de login:', { email, password });
    const result = login(email, password);
    console.log('AuthProvider - Résultat login:', result);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const handleRegister = (username, email, password) => {
    console.log('AuthProvider - Tentative d\'inscription:', { username, email, password });
    const result = register(username, email, password);
    console.log('AuthProvider - Résultat inscription:', result);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};