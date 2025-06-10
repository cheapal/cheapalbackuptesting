import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section 
      className="py-20"
      style={{
        backgroundColor: 'var(--color-scheme-secondary)',
        borderBottom: '1px solid var(--color-scheme-accent)'
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <h1 
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{
            color: 'var(--color-scheme-accent)',
            textShadow: '0 0 10px var(--color-scheme-accent)'
          }}
        >
          Find Affordable Shared Subscriptions
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-white">
          Join thousands of users saving money by sharing premium subscriptions
        </p>
        <Link
          to="/subscriptions"
          className="inline-block px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-neon"
          style={{
            backgroundColor: 'var(--color-scheme-accent)',
            color: 'var(--color-scheme-bg)',
            boxShadow: '0 0 15px var(--color-scheme-accent)'
          }}
        >
          Browse Subscriptions
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;