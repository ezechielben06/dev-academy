import React from 'react';
import { Link } from 'react-router-dom';

const ExerciseCard = ({ exercise, isCompleted }) => {
  const difficultyConfig = {
    easy: { 
      label: 'Facile', 
      class: 'badge-easy', 
      icon: 'fa-seedling',
      gradient: 'from-green-500 to-emerald-500',
      points: 10
    },
    medium: { 
      label: 'Moyen', 
      class: 'badge-medium', 
      icon: 'fa-chart-line',
      gradient: 'from-yellow-500 to-orange-500',
      points: 20
    },
    hard: { 
      label: 'Difficile', 
      class: 'badge-hard', 
      icon: 'fa-mountain',
      gradient: 'from-red-500 to-rose-500',
      points: 30
    }
  };

  const diff = difficultyConfig[exercise.difficulty];

  return (
    <Link to={`/exercise/${exercise.id}`}>
      <div className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Card content */}
        <div className="relative bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-white/10 rounded-2xl p-6 transition-all duration-300 group-hover:border-purple-500/30 group-hover:shadow-2xl">
          
          {/* Header with difficulty badge */}
          <div className="flex justify-between items-start mb-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${diff.gradient} bg-opacity-10`}>
              <i className={`fas ${diff.icon} text-xs text-white`}></i>
              <span className="text-xs font-semibold text-white">{diff.label}</span>
            </div>
            
            {isCompleted ? (
              <div className="flex items-center gap-1.5 bg-green-500/10 px-3 py-1.5 rounded-full">
                <i className="fas fa-check-circle text-green-500 text-xs"></i>
                <span className="text-xs font-medium text-green-500">Complété</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5">
                <i className="fas fa-star text-yellow-500 text-xs"></i>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{diff.points} pts</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:gradient-text transition-all">
            {exercise.title}
          </h3>
          
          {/* Description preview */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
            {exercise.description.substring(0, 100)}...
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {exercise.tags.map((tag, idx) => (
              <span key={idx} className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
                #{tag}
              </span>
            ))}
          </div>
          
          {/* Footer with stats */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <i className="far fa-file-code"></i>
                <span>{exercise.examples.length} exemples</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <i className="far fa-lightbulb"></i>
                <span>{exercise.hints.length} indices</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              <span>Commencer</span>
              <i className="fas fa-arrow-right text-xs"></i>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ExerciseCard;