import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div 
      className="flex items-center gap-3 cursor-pointer"
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Label - BIGGER */}
      <motion.span 
        className="font-body text-[11px] font-semibold tracking-[0.1em] uppercase"
        animate={{ 
          color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
          scale: isHovering ? 1.05 : 1
        }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? 'Dark' : 'Day'}
      </motion.span>

      {/* Toggle Track - BIGGER & BOLDER */}
      <motion.div 
        className="relative w-12 h-6 rounded-full flex-shrink-0"
        animate={{
          background: isDark 
            ? 'linear-gradient(135deg, #1a1a2e, #16213e)' 
            : 'linear-gradient(135deg, #f7971e, #ffd200)',
          boxShadow: isDark 
            ? `0 0 ${isHovering ? '30px' : '15px'} rgba(124,58,237,${isHovering ? '0.5' : '0.25'})` 
            : `0 0 ${isHovering ? '30px' : '15px'} rgba(255,210,0,${isHovering ? '0.5' : '0.25'})`,
          scale: isHovering ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Pulsing glow behind toggle */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            opacity: isHovering ? 0.8 : 0.3,
            scale: isHovering ? 1.2 : 1,
          }}
          transition={{ duration: 0.5 }}
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(124,58,237,0.3), transparent)' 
              : 'radial-gradient(circle, rgba(255,210,0,0.3), transparent)',
          }}
        />

        {/* Knob - BIGGER with spring animation */}
        <motion.div
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg flex items-center justify-center"
          animate={{ 
            x: isDark ? 28 : 2,
            scale: isHovering ? 1.15 : 1,
            boxShadow: isDark 
              ? '0 2px 15px rgba(124,58,237,0.4)' 
              : '0 2px 15px rgba(255,210,0,0.4)'
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 500, 
            damping: 30 
          }}
        >
          {isDark ? (
            <Moon size={9} color="#7C3AED" fill="#7C3AED" />
          ) : (
            <Sun size={9} color="#f7971e" fill="#f7971e" />
          )}
        </motion.div>

        {/* Animated sparkle effect on toggle */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{
            opacity: isHovering ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: isDark 
              ? 'radial-gradient(circle at 70%, rgba(124,58,237,0.15), transparent)' 
              : 'radial-gradient(circle at 70%, rgba(255,210,0,0.15), transparent)',
          }}
        />
      </motion.div>
    </div>
  );
};

export default ThemeToggle;
