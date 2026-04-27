import React from 'react';

const Card = ({ children, className = '', hover = true }) => {
  return (
    <div className={`glass-card p-6 ${hover ? 'hover:scale-105 hover:shadow-2xl transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;