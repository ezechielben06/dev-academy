import React from 'react';
import Card from '../UI/Card';

const ProgressBar = ({ progress }) => {
  const percentage = (progress.completed / progress.total) * 100;

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Progression globale</h3>
          <span className="text-2xl font-bold gradient-text">{Math.round(percentage)}%</span>
        </div>
        
        <div className="relative">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full gradient-bg rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{progress.completed} exercices résolus</span>
          <span>{progress.total} exercices au total</span>
        </div>
      </div>
    </Card>
  );
};

export default ProgressBar;