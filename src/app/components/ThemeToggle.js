'use client';

import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            {darkMode ? '🌞' : '🌙'}
        </button>
    );
}