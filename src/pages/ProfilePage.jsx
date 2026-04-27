import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats, getCompletedExercises, getExercises, resetAllData, getUserData } from '../services/authService';
import Notification from '../components/UI/Notification';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState({
    username: '',
    email: '',
    joinDate: '',
    avatar: ''
  });
  const [stats, setStats] = useState({ completed: 0, points: 0, streak: 0 });
  const [level, setLevel] = useState('Débutant');
  const [nextLevelPoints, setNextLevelPoints] = useState(200);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [badges, setBadges] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Générer un avatar basé sur le nom d'utilisateur
  const getAvatar = (username) => {
    const avatars = ['👨‍💻', '👩‍💻', '🧑‍💻', '🚀', '⚡', '🎯', '💪', '🌟', '🔥', '💻'];
    const index = username?.length % avatars.length || 0;
    return avatars[index];
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Nouveau membre';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProfileData();
  }, [user]);

  const loadProfileData = () => {
    setIsLoading(true);
    
    // Récupérer les données utilisateur
    const userData = getUserData(user.id);
    
    // Mettre à jour le profil
    setUserProfile({
      username: user.username || 'CodeWarrior',
      email: user.email || 'utilisateur@codearena.com',
      joinDate: formatDate(user.createdAt),
      avatar: getAvatar(user.username)
    });
    
    // Récupérer les stats
    const userStats = getUserStats();
    const completed = getCompletedExercises();
    
    // Calculer le niveau
    let currentLevel = 'Débutant';
    let nextPoints = 200;
    if (userStats.points >= 1000) {
      currentLevel = 'Expert';
      nextPoints = 1000;
    } else if (userStats.points >= 500) {
      currentLevel = 'Avancé';
      nextPoints = 500;
    } else if (userStats.points >= 200) {
      currentLevel = 'Intermédiaire';
      nextPoints = 200;
    }
    
    setLevel(currentLevel);
    setNextLevelPoints(nextPoints);
    setStats(userStats);
    
    // Récupérer le total des exercices
    getExercises().then(exercises => {
      setProgress({ completed: userStats.completed, total: exercises.length });
    });
    
    // Générer les badges
    const earnedBadges = [];
    
    // Badges de progression
    if (userStats.completed >= 1) {
      earnedBadges.push({ 
        name: 'Premier pas', 
        description: 'Premier exercice complété', 
        icon: 'fa-footstep', 
        color: 'from-gray-500 to-gray-600',
        requirement: 1
      });
    }
    if (userStats.completed >= 5) {
      earnedBadges.push({ 
        name: 'Apprenti codeur', 
        description: '5 exercices complétés', 
        icon: 'fa-graduation-cap', 
        color: 'from-amber-600 to-amber-700',
        requirement: 5
      });
    }
    if (userStats.completed >= 10) {
      earnedBadges.push({ 
        name: 'Codeur passionné', 
        description: '10 exercices complétés', 
        icon: 'fa-heart', 
        color: 'from-blue-500 to-blue-600',
        requirement: 10
      });
    }
    if (userStats.completed >= 20) {
      earnedBadges.push({ 
        name: 'Maître du code', 
        description: '20 exercices complétés', 
        icon: 'fa-crown', 
        color: 'from-yellow-500 to-yellow-600',
        requirement: 20
      });
    }
    if (userStats.completed >= 50) {
      earnedBadges.push({ 
        name: 'Légende vivante', 
        description: '50 exercices complétés', 
        icon: 'fa-dragon', 
        color: 'from-purple-600 to-pink-600',
        requirement: 50
      });
    }
    
    // Badges de streak
    if (userStats.streak >= 3) {
      earnedBadges.push({ 
        name: 'Régulier', 
        description: '3 jours consécutifs', 
        icon: 'fa-calendar-check', 
        color: 'from-green-500 to-green-600',
        requirement: 3
      });
    }
    if (userStats.streak >= 7) {
      earnedBadges.push({ 
        name: 'Enflammé', 
        description: '7 jours consécutifs', 
        icon: 'fa-fire', 
        color: 'from-orange-500 to-red-500',
        requirement: 7
      });
    }
    if (userStats.streak >= 30) {
      earnedBadges.push({ 
        name: 'Légende du streak', 
        description: '30 jours consécutifs', 
        icon: 'fa-infinity', 
        color: 'from-purple-600 to-indigo-600',
        requirement: 30
      });
    }
    
    // Badges de points
    if (userStats.points >= 100) {
      earnedBadges.push({ 
        name: 'Collectionneur', 
        description: '100 points accumulés', 
        icon: 'fa-star', 
        color: 'from-yellow-500 to-yellow-600',
        requirement: 100
      });
    }
    if (userStats.points >= 500) {
      earnedBadges.push({ 
        name: 'Maître des points', 
        description: '500 points accumulés', 
        icon: 'fa-gem', 
        color: 'from-cyan-500 to-blue-500',
        requirement: 500
      });
    }
    
    // Trier les badges par exigence
    earnedBadges.sort((a, b) => a.requirement - b.requirement);
    
    setBadges(earnedBadges);
    setIsLoading(false);
  };

  const handleResetProgress = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cette action est irréversible.')) {
      resetAllData();
      loadProfileData();
      setNotification({ message: 'Progression réinitialisée avec succès', type: 'warning' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('⚠️ Attention : Cette action supprimera définitivement votre compte et toutes vos données. Êtes-vous absolument sûr ?')) {
      // Supprimer le compte
      localStorage.removeItem('codearena_current_user');
      const users = JSON.parse(localStorage.getItem('codearena_users') || '[]');
      const updatedUsers = users.filter(u => u.id !== user.id);
      localStorage.setItem('codearena_users', JSON.stringify(updatedUsers));
      logout();
      navigate('/register');
      setNotification({ message: 'Compte supprimé avec succès', type: 'info' });
    }
  };

  const levelProgress = (stats.points / nextLevelPoints) * 100;
  const globalProgress = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

  const statItems = [
    { label: 'Exercices résolus', value: stats.completed, icon: 'fa-check-circle', color: 'text-green-500' },
    { label: 'Points totaux', value: stats.points, icon: 'fa-star', color: 'text-yellow-500' },
    { label: 'Streak actuel', value: `${stats.streak} jour${stats.streak > 1 ? 's' : ''}`, icon: 'fa-fire', color: 'text-orange-500' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-purple-600"></i>
          <p className="mt-4 text-gray-500">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom space-y-8 animate-fade py-8">
      {/* Profile Header */}
      <div className="card-glass p-8 text-center">
        <div className="relative inline-block">
          <div className="w-28 h-28 mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-5xl shadow-xl">
            {userProfile.avatar}
          </div>
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
        </div>
        
        <h2 className="text-2xl font-bold mt-4 gradient-text">{userProfile.username}</h2>
        <p className="text-gray-500 dark:text-gray-400">{userProfile.email}</p>
        <p className="text-sm text-gray-400 mt-2">
          <i className="fas fa-calendar-alt mr-1"></i>
          Membre depuis {userProfile.joinDate}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statItems.map((item, idx) => (
          <div key={idx} className="card-glass p-6 text-center hover:scale-105 transition-transform duration-300">
            <i className={`fas ${item.icon} ${item.color} text-3xl mb-3`}></i>
            <h3 className="text-2xl font-bold gradient-text">{item.value}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Level Progress */}
      <div className="card-glass p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Niveau {level}</h3>
            <p className="text-sm text-gray-500 mt-1">{stats.points} / {nextLevelPoints} points</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
            <i className="fas fa-chart-line text-white"></i>
          </div>
        </div>
        <div className="relative h-3 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(levelProgress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Global Progress */}
      <div className="card-glass p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Progression globale</h3>
          <span className="text-sm text-gray-500">
            {progress.completed} / {progress.total} exercices
          </span>
        </div>
        <div className="relative h-3 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${globalProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Badges */}
      <div className="card-glass p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-medal text-yellow-500"></i>
          Badges gagnés ({badges.length})
        </h3>
        
        {badges.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-medal text-5xl text-gray-400 mb-3"></i>
            <p className="text-gray-500">Aucun badge pour le moment</p>
            <p className="text-sm text-gray-400 mt-2">Continuez à résoudre des exercices pour débloquer des badges !</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badges.map((badge, idx) => (
              <div key={idx} className="group relative">
                <div className={`p-4 rounded-xl text-center bg-gradient-to-br ${badge.color} bg-opacity-10 transition-all duration-300 hover:scale-105 cursor-pointer`}>
                  <i className={`fas ${badge.icon} text-3xl mb-2 text-white`}></i>
                  <h4 className="font-semibold text-sm text-white">{badge.name}</h4>
                  <p className="text-xs text-white/80 mt-1">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={handleResetProgress}
          className="px-6 py-3 rounded-xl border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 transition-all duration-300"
        >
          <i className="fas fa-undo-alt mr-2"></i>
          Réinitialiser ma progression
        </button>
        <button 
          onClick={handleDeleteAccount}
          className="px-6 py-3 rounded-xl border-2 border-red-500 text-red-500 hover:bg-red-500/10 transition-all duration-300"
        >
          <i className="fas fa-trash-alt mr-2"></i>
          Supprimer mon compte
        </button>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default ProfilePage;