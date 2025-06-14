import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div 
        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
        style={{
          borderColor: 'var(--color-scheme-accent)'
        }}
      ></div>
    </div>
  );
};


export default LoadingSpinner;