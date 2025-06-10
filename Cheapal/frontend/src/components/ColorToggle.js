import { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ColorToggle = () => {
  const [isAltScheme, setIsAltScheme] = useState(false);

  useEffect(() => {
    // Check localStorage for saved preference
    const savedScheme = localStorage.getItem('colorScheme');
    if (savedScheme === 'alt') {
      document.documentElement.classList.add('color-scheme-alt');
      setIsAltScheme(true);
    }
  }, []);

  const toggleColors = () => {
    const root = document.documentElement;
    if (isAltScheme) {
      root.classList.remove('color-scheme-alt');
      localStorage.setItem('colorScheme', 'default');
    } else {
      root.classList.add('color-scheme-alt');
      localStorage.setItem('colorScheme', 'alt');
    }
    setIsAltScheme(!isAltScheme);
  };

  return (
    <button
      onClick={toggleColors}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
      style={{
        backgroundColor: 'var(--color-scheme-accent)',
        color: 'var(--color-scheme-bg)'
      }}
      aria-label="Toggle color scheme"
    >
      {isAltScheme ? <FaMoon size={20} /> : <FaSun size={20} />}
    </button>
  );
};

export default ColorToggle;