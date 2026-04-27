import React, { useState, useEffect } from 'react';
import ExerciseCard from './ExerciseCard';
import { getCompletedExercises } from '../../services/exerciseService';

const ExerciseList = ({ exercises }) => {
  const [completedIds, setCompletedIds] = useState([]);

  useEffect(() => {
    const completed = getCompletedExercises();
    setCompletedIds(completed.map(c => c.id));
  }, []);

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <i className="fas fa-inbox text-6xl text-gray-400 mb-4"></i>
        <p className="text-gray-600 dark:text-gray-400">Aucun exercice trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {exercises.map((exercise) => (
        <ExerciseCard 
          key={exercise.id} 
          exercise={exercise} 
          isCompleted={completedIds.includes(exercise.id)}
        />
      ))}
    </div>
  );
};

export default ExerciseList;
