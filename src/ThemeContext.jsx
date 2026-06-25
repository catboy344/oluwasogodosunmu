import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check if user has a theme preference stored
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true; // Default to dark
  });

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Save theme preference and apply to body
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.body.style.background = isDark ? '#07080C' : '#f5f5f5';
    document.body.style.color = isDark ? '#ffffff' : '#000000';
    document.body.style.transition = 'all 0.3s ease';
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
