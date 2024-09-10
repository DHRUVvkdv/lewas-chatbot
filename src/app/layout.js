'use client';

import './globals.css';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const RootLayout = ({ children }) => {
  return (
    <ThemeProvider>
      <LayoutContent>{children}</LayoutContent>
    </ThemeProvider>
  );
};

const LayoutContent = ({ children }) => {
  const { darkMode } = useTheme();

  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <body className={`${darkMode ? 'dark:bg-gray-900 dark:text-white' : 'bg-white text-black'} transition-colors duration-200`}>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;