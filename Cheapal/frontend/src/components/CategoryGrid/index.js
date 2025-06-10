import React from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from './CategoryCard';

const categories = [
  { id: 'streaming', name: 'Streaming', icon: '🎬' },
  { id: 'productivity', name: 'Productivity', icon: '💼' },
  { id: 'ai', name: 'AI Tools', icon: '🤖' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'vpn', name: 'VPN', icon: '🔒' },
  { id: 'education', name: 'Education', icon: '📚' }
];

function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link to={`/categories/${category.id}`} key={category.id}>
          <CategoryCard category={category} />
        </Link>
      ))}
    </div>
  );
}

export default CategoryGrid;