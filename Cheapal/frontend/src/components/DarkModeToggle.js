import { useEffect } from 'react';

export default function DarkModeToggle() {
  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
      aria-label="Toggle dark mode"
    >
      {document.documentElement.classList.contains('dark') ? '☀️' : '🌙'}
    </button>
  );
}