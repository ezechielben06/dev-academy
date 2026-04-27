import React, { useState, useEffect } from 'react';

const ExerciseFilters = ({ filters, onFilterChange }) => {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  
  const difficulties = [
    { value: 'all', label: 'Tous', icon: 'fa-layer-group' },
    { value: 'easy', label: 'Facile', icon: 'fa-seedling' },
    { value: 'medium', label: 'Moyen', icon: 'fa-chart-line' },
    { value: 'hard', label: 'Difficile', icon: 'fa-mountain' }
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange({ ...filters, search: searchValue });
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  return (
    <div className="card-glass p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
            <input
              type="text"
              placeholder="Rechercher un exercice..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="input-modern pl-11"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          {difficulties.map((diff) => (
            <button
              key={diff.value}
              onClick={() => onFilterChange({ ...filters, difficulty: diff.value })}
              className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                filters.difficulty === diff.value
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <i className={`fas ${diff.icon} text-sm`}></i>
              <span className="hidden sm:inline">{diff.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseFilters;