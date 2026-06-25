export const getThemeColors = (isDark) => ({
  // Backgrounds
  background: isDark ? '#07080C' : '#f5f5f5',
  backgroundNav: isDark ? 'rgba(7,8,12,0.9)' : 'rgba(255,255,255,0.9)',
  backgroundNavTransparent: isDark ? 'rgba(7,8,12,0.5)' : 'rgba(255,255,255,0.5)',
  backgroundCard: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
  backgroundInput: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  backgroundModal: isDark ? '#0E1015' : '#ffffff',
  
  // Text
  textPrimary: isDark ? '#ffffff' : '#000000',
  textSecondary: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
  textMuted: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
  textLight: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)',
  
  // Borders
  borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
  borderLight: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
  
  // Others
  shadow: isDark ? '0 30px 80px rgba(0,0,0,0.9)' : '0 30px 80px rgba(0,0,0,0.1)',
});
