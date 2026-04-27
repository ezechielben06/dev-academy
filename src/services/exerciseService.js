// Service pour gérer les exercices et le localStorage

let exercisesCache = null;

// Récupère tous les exercices depuis le fichier JSON
export const getExercises = async () => {
  if (exercisesCache) return exercisesCache;
  
  try {
    const response = await fetch('/data/exercises.json');
    if (!response.ok) throw new Error('Erreur de chargement des exercices');
    const data = await response.json();
    exercisesCache = data.exercises;
    return exercisesCache;
  } catch (error) {
    console.error('Erreur lors du chargement des exercices:', error);
    return [];
  }
};

// Récupère un exercice par son ID
export const getExerciseById = async (id) => {
  const exercises = await getExercises();
  return exercises.find(ex => ex.id === id);
};

// Récupère les solutions sauvegardées
export const getSavedSolutions = () => {
  const saved = localStorage.getItem('codearena_solutions');
  return saved ? JSON.parse(saved) : {};
};

// Récupère une solution sauvegardée pour un exercice
export const getSavedSolution = (exerciseId) => {
  const solutions = getSavedSolutions();
  return solutions[exerciseId] || null;
};

// Sauvegarde une solution
export const saveSolution = (exerciseId, code) => {
  const solutions = getSavedSolutions();
  solutions[exerciseId] = code;
  localStorage.setItem('codearena_solutions', JSON.stringify(solutions));
};

// Récupère les exercices complétés
export const getCompletedExercises = () => {
  const completed = localStorage.getItem('codearena_completed');
  return completed ? JSON.parse(completed) : [];
};

// Marque un exercice comme complété
export const markAsCompleted = (exerciseId) => {
  const completed = getCompletedExercises();
  if (!completed.find(c => c.id === exerciseId)) {
    completed.push({
      id: exerciseId,
      completedAt: new Date().toISOString()
    });
    localStorage.setItem('codearena_completed', JSON.stringify(completed));
    
    // Mettre à jour le streak
    updateStreak();
  }
};

// Met à jour le streak quotidien
const updateStreak = () => {
  const lastActivity = localStorage.getItem('codearena_last_activity');
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
    
    localStorage.setItem('codearena_streak', streak.toString());
    localStorage.setItem('codearena_last_activity', today);
  }
};

// Récupère le streak
export const getStreak = () => {
  const streak = localStorage.getItem('codearena_streak');
  return streak ? parseInt(streak) : 0;
};

// Calcule les statistiques utilisateur
export const getUserStats = () => {
  const completed = getCompletedExercises();
  const streak = getStreak();
  
  // Calcul des points (10 points par exercice, bonus pour les streaks)
  let points = completed.length * 10;
  if (streak >= 7) points += 50;
  if (streak >= 30) points += 200;
  
  return {
    completed: completed.length,
    points: points,
    streak: streak
  };
};

// Réinitialise toutes les données
export const resetAllData = () => {
  localStorage.removeItem('codearena_solutions');
  localStorage.removeItem('codearena_completed');
  localStorage.removeItem('codearena_streak');
  localStorage.removeItem('codearena_last_activity');
};