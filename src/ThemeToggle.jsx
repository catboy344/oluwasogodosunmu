import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      className="relative flex items-center gap-2 cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={toggleTheme}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Label */}
      <span 
        className="font-body text-[10px] tracking-[0.15em] uppercase font-medium hidden sm:block"
        style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
      >
        {isDark ? 'Dark Mode' : 'Day Mode'}
      </span>

      {/* Toggle Track */}
      <div 
        className="relative w-14 h-8 rounded-full transition-all duration-300 ease-in-out flex items-center px-1"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #1a1a2e, #16213e)' 
            : 'linear-gradient(135deg, #f7971e, #ffd200)',
          boxShadow: isDark 
            ? 'inset 0 2px 4px rgba(0,0,0,0.4), 0 0 20px rgba(124,58,237,0.15)' 
            : 'inset 0 2px 4px rgba(0,0,0,0.1), 0 0 20px rgba(255,210,0,0.2)',
          border: isDark 
            ? '1px solid rgba(255,255,255,0.1)' 
            : '1px solid rgba(255,210,0,0.3)',
        }}
      >
        {/* Toggle Knob */}
        <motion.div
          className="relative w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
          animate={{
            x: isDark ? 24 : 0,
            background: isDark 
              ? 'linear-gradient(135deg, #4a4a6a, #2d2d44)' 
              : 'linear-gradient(135deg, #ffffff, #f0f0f0)',
            boxShadow: isDark 
              ? '0 2px 10px rgba(0,0,0,0.5), 0 0 20px rgba(124,58,237,0.2)' 
              : '0 2px 10px rgba(0,0,0,0.2), 0 0 20px rgba(255,210,0,0.2)',
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
        >
          {/* Icon inside knob */}
          <motion.div
            animate={{
              rotate: isDark ? 0 : 180,
              scale: isDark ? 1 : 1.1,
            }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? (
              <Moon size={14} color="#a78bfa" fill="#a78bfa" />
            ) : (
              <Sun size={14} color="#f7971e" fill="#f7971e" />
            )}
          </motion.div>

          {/* Glow effect on knob */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              opacity: isDark ? 0.5 : 0.3,
              scale: isHovering ? 1.3 : 0.8,
            }}
            transition={{ duration: 0.3 }}
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(124,58,237,0.3), transparent)' 
                : 'radial-gradient(circle, rgba(255,210,0,0.3), transparent)',
            }}
          />
        </motion.div>

        {/* Toggle glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{
            opacity: isHovering ? 0.6 : 0,
            scale: isHovering ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(124,58,237,0.15), transparent)' 
              : 'radial-gradient(circle, rgba(255,210,0,0.15), transparent)',
          }}
        />
      </div>

      {/* Tooltip on hover */}
      <motion.div
        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[9px] font-body whitespace-nowrap pointer-events-none"
        animate={{
          opacity: isHovering ? 1 : 0,
          y: isHovering ? 0 : 4,
        }}
        transition={{ duration: 0.2 }}
        style={{
          background: isDark ? 'rgba(20,20,28,0.9)' : 'rgba(255,255,255,0.9)',
          color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        {isDark ? 'Switch to Light' : 'Switch to Dark'}
      </motion.div>
    </motion.div>
  );
};

export default ThemeToggle;
