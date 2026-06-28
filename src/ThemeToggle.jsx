import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div 
      className="flex items-center gap-2 cursor-pointer"
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Label */}
      <span 
        className="font-body text-[9px] font-medium tracking-[0.08em] uppercase transition-colors duration-300"
        style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
      >
        {isDark ? 'Dark' : 'Day'}
      </span>

      {/* Toggle Track with GLOW */}
      <div 
        className="relative w-9 h-5 rounded-full transition-all duration-300 flex-shrink-0"
        style={{
          background: isDark ? '#4a4a6a' : '#f7971e',
          boxShadow: isDark 
            ? `0 0 ${isHovering ? '20px' : '10px'} rgba(124,58,237,${isHovering ? '0.4' : '0.2'})` 
            : `0 0 ${isHovering ? '20px' : '10px'} rgba(255,210,0,${isHovering ? '0.4' : '0.2'})`,
          transition: 'box-shadow 0.3s ease'
        }}
      >
        {/* Knob with SMOOTH SPRING transition */}
        <motion.div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md flex items-center justify-center"
          animate={{ 
            x: isDark ? 18 : 1.5,
            scale: isHovering ? 1.1 : 1
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 500, 
            damping: 30 
          }}
        >
          {isDark ? (
            <Moon size={8} color="#4a4a6a" fill="#4a4a6a" />
          ) : (
            <Sun size={8} color="#f7971e" fill="#f7971e" />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ThemeToggle;
