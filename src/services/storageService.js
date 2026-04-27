// Service pour la gestion du localStorage

// Clés pour le localStorage
const STORAGE_KEYS = {
  SOLUTIONS: 'codearena_solutions',
  COMPLETED: 'codearena_completed',
  STREAK: 'codearena_streak',
  LAST_ACTIVITY: 'codearena_last_activity',
  THEME: 'codearena_theme'
};

// Solutions sauvegardées
export const getSavedSolutions = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.SOLUTIONS);
  return saved ? JSON.parse(saved) : {};
};

export const getSavedSolution = (exerciseId) => {
  const solutions = getSavedSolutions();
  return solutions[exerciseId] || null;
};

export const saveSolution = (exerciseId, code) => {
  const solutions = getSavedSolutions();
  solutions[exerciseId] = code;
  localStorage.setItem(STORAGE_KEYS.SOLUTIONS, JSON.stringify(solutions));
};

// Exercices complétés
export const getCompletedExercises = () => {
  const completed = localStorage.getItem(STORAGE_KEYS.COMPLETED);
  return completed ? JSON.parse(completed) : [];
};

export const markAsCompleted = (exerciseId) => {
  const completed = getCompletedExercises();
  if (!completed.find(c => c.id === exerciseId)) {
    completed.push({
      id: exerciseId,
      completedAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify(completed));
    updateStreak();
  }
};

export const isExerciseCompleted = (exerciseId) => {
  const completed = getCompletedExercises();
  return completed.some(c => c.id === exerciseId);
};

// Streak quotidien
export const getStreak = () => {
  const streak = localStorage.getItem(STORAGE_KEYS.STREAK);
  return streak ? parseInt(streak) : 0;
};

const updateStreak = () => {
  const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
  const today = new Date().toDateString();
  
  if (lastActivity !== today) {
    let streak = getStreak();
    
    if (lastActivity) {
      const lastDate = new Date(lastActivity);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate.toDateString() === yesterday.toDateString()) {
        streak++;
      } else if (lastDate.toDateString() !== today) {
        streak = 1;
      }
    } else {
      streak = 1;
    }
    
    localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, today);
  }
};

// Statistiques utilisateur
export const getUserStats = () => {
  const completed = getCompletedExercises();
  const streak = getStreak();
  
  let points = completed.length * 10;
  if (streak >= 7) points += 50;
  if (streak >= 30) points += 200;
  
  return {
    completed: completed.length,
    points: points,
    streak: streak
  };
};

// Réinitialisation des données
export const resetAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.SOLUTIONS);
  localStorage.removeItem(STORAGE_KEYS.COMPLETED);
  localStorage.removeItem(STORAGE_KEYS.STREAK);
  localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
};

// Thème
export const getSavedTheme = () => {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
};

export const saveTheme = (theme) => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};