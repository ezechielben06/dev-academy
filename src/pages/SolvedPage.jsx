import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCompletedExercises, getExercises, getUserStats } from '../services/exerciseService';

const SolvedPage = () => {
  const [completedExercises, setCompletedExercises] = useState([]);
  const [stats, setStats] = useState({ completed: 0, points: 0, streak: 0 });
  const [allExercises, setAllExercises] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const completed = getCompletedExercises();
      const exercises = await getExercises();
      const userStats = getUserStats();
      
      const completedDetails = completed.map(completed => {
        const exercise = exercises.find(e => e.id === completed.id);
        return { ...exercise, completedAt: completed.completedAt };
      }).filter(e => e);
      
      setCompletedExercises(completedDetails);
      setAllExercises(exercises);
      setStats(userStats);
    };
    loadData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const difficultyConfig = {
    easy: { label: 'Facile', class: 'badge-easy', icon: 'fa-seedling' },
    medium: { label: 'Moyen', class: 'badge-medium', icon: 'fa-chart-line' },
    hard: { label: 'Difficile', class: 'badge-hard', icon: 'fa-mountain' }
  };

  const statCards = [
    { icon: 'fa-check-circle', value: stats.completed, label: 'Exercices résolus', color: 'text-green-500' },
    { icon: 'fa-star', value: stats.points, label: 'Points accumulés', color: 'text-yellow-500' },
    { icon: 'fa-fire', value: `${stats.streak} jours`, label: 'Streak actuel', color: 'text-orange-500' },
  ];

  return (
    <div className="container-custom space-y-12 animate-fade">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-4">Exercices résolus</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {stats.completed === 0 
            ? "Commencez votre premier exercice !" 
            : `Félicitations ! Vous avez complété ${stats.completed} exercice${stats.completed > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="card-glass p-6 text-center">
            <i className={`fas ${stat.icon} ${stat.color} text-3xl mb-3`}></i>
            <h3 className="text-3xl font-bold gradient-text">{stat.value}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="card-glass p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Progression</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {completedExercises.length} / {allExercises.length} exercices
          </span>
        </div>
        <div className="relative h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
            style={{ width: `${(completedExercises.length / allExercises.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Exercises Grid */}
      {completedExercises.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <i className="fas fa-folder-open text-6xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">Aucun exercice résolu</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Vous n'avez pas encore complété d'exercices.
          </p>
          <Link to="/">
            <button className="btn-primary">
              <i className="fas fa-play mr-2"></i>
              Commencer un exercice
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedExercises.map((exercise) => {
            const diff = difficultyConfig[exercise.difficulty];
            return (
              <Link key={exercise.id} to={`/exercise/${exercise.id}`}>
                <div className="card-glass p-6 group cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:gradient-text transition-all">
                      {exercise.title}
                    </h3>
                    <i className="fas fa-check-circle text-green-500 text-lg"></i>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`badge ${diff.class} flex items-center gap-1`}>
                      <i className={`fas ${diff.icon} text-xs`}></i>
                      {diff.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      Complété le {formatDate(exercise.completedAt)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {exercise.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SolvedPage;