import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCompletedExercises, getExercises, getUserStats } from '../services/authService';

const SolvedPage = () => {
  const { user } = useAuth();
  const [completedExercises, setCompletedExercises] = useState([]);
  const [stats, setStats] = useState({ completed: 0, points: 0, streak: 0 });
  const [allExercises, setAllExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const completed = getCompletedExercises();
      const exercises = await getExercises();
      const userStats = getUserStats();
      
      // Enrichir les exercices complétés avec les détails
      const completedDetails = completed.map(completed => {
        const exercise = exercises.find(e => e.id === completed.id);
        return { ...exercise, completedAt: completed.completedAt };
      }).filter(e => e);
      
      setCompletedExercises(completedDetails);
      setAllExercises(exercises);
      setStats(userStats);
    } catch (error) {
      console.error('Erreur chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const difficultyConfig = {
    easy: { label: 'Facile', class: 'badge-easy', icon: 'fa-seedling' },
    medium: { label: 'Moyen', class: 'badge-medium', icon: 'fa-chart-line' },
    hard: { label: 'Difficile', class: 'badge-hard', icon: 'fa-mountain' }
  };

  const statCards = [
    { icon: 'fa-check-circle', value: stats.completed, label: 'Exercices résolus', color: 'text-green-500', suffix: '' },
    { icon: 'fa-star', value: stats.points, label: 'Points accumulés', color: 'text-yellow-500', suffix: '' },
    { icon: 'fa-fire', value: stats.streak, label: 'Streak actuel', color: 'text-orange-500', suffix: stats.streak > 1 ? ' jours' : ' jour' },
  ];

  const progressPercentage = allExercises.length > 0 
    ? (completedExercises.length / allExercises.length) * 100 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-purple-600"></i>
          <p className="mt-4 text-gray-500">Chargement de vos exercices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom space-y-12 animate-fade py-8">
      {/* Header avec bienvenue personnalisée */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/10 mb-4">
          <i className="fas fa-trophy text-purple-600"></i>
          <span className="text-sm text-purple-600 dark:text-purple-400">
            {user?.username}
          </span>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-4">Exercices résolus</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {stats.completed === 0 
            ? "✨ Commencez votre premier exercice ! ✨" 
            : `🎉 Félicitations ${user?.username} ! Vous avez complété ${stats.completed} exercice${stats.completed > 1 ? 's' : ''} 🎉`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="card-glass p-6 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mb-3">
              <i className={`fas ${stat.icon} ${stat.color} text-2xl`}></i>
            </div>
            <h3 className="text-3xl font-bold gradient-text">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              {stat.suffix && <span className="text-sm ml-1">{stat.suffix}</span>}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="card-glass p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Progression globale</h3>
            <p className="text-sm text-gray-500 mt-1">
              {completedExercises.length} / {allExercises.length} exercices complétés
            </p>
          </div>
          <div className="text-2xl font-bold gradient-text">
            {Math.round(progressPercentage)}%
          </div>
        </div>
        <div className="relative h-3 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Prochain objectif */}
      {stats.completed > 0 && stats.completed < 10 && (
        <div className="card-glass p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <i className="fas fa-bullseye text-yellow-500 text-2xl"></i>
              <div>
                <p className="font-semibold">Prochain objectif</p>
                <p className="text-sm text-gray-500">
                  Encore {10 - stats.completed} exercice{10 - stats.completed > 1 ? 's' : ''} pour débloquer le badge "Dévoué" !
                </p>
              </div>
            </div>
            <div className="w-32 h-2 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                style={{ width: `${(stats.completed / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Exercises Grid */}
      {completedExercises.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-folder-open text-4xl text-gray-400"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">Aucun exercice résolu</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Vous n'avez pas encore complété d'exercices. Commencez votre premier défi dès maintenant !
          </p>
          <Link to="/">
            <button className="btn-primary">
              <i className="fas fa-play mr-2"></i>
              Commencer un exercice
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold gradient-text">
              Vos accomplissements
            </h2>
            <span className="text-sm text-gray-500">
              {completedExercises.length} exercice{completedExercises.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedExercises.map((exercise, index) => {
              const diff = difficultyConfig[exercise.difficulty];
              return (
                <Link key={exercise.id} to={`/exercise/${exercise.id}`}>
                  <div className="card-glass p-6 group cursor-pointer hover:scale-105 transition-all duration-300 animate-fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:gradient-text transition-all">
                        {exercise.title}
                      </h3>
                      <div className="flex items-center gap-1 text-green-500">
                        <i className="fas fa-check-circle text-lg"></i>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`badge ${diff.class} flex items-center gap-1`}>
                        <i className={`fas ${diff.icon} text-xs`}></i>
                        {diff.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        <i className="far fa-calendar-alt mr-1"></i>
                        {formatDate(exercise.completedAt)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {exercise.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
                          #{tag}
                        </span>
                      ))}
                      {exercise.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500">
                          +{exercise.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {/* Animation de confirmation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-green-500/0 rounded-xl transition-all duration-500 pointer-events-none"></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SolvedPage;