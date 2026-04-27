// Service d'authentification
const USERS_KEY = 'codearena_users';
const CURRENT_USER_KEY = 'codearena_current_user';

// Structure d'un utilisateur
const createUserStructure = (id, username, email, password) => ({
  id,
  username,
  email,
  password,
  createdAt: new Date().toISOString(),
  stats: {
    completed: 0,
    points: 0,
    streak: 0,
    lastActivity: null
  },
  completedExercises: [],
  solutions: {},
  badges: []
});

// Récupérer tous les utilisateurs
export const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Sauvegarder les utilisateurs
const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Inscription
export const register = (username, email, password) => {
  const users = getUsers();
  
  if (users.some(u => u.email === email)) {
    return { success: false, error: 'Cet email est déjà utilisé' };
  }
  
  if (users.some(u => u.username === username)) {
    return { success: false, error: 'Ce nom d\'utilisateur est déjà pris' };
  }
  
  const newUser = createUserStructure(
    Date.now(),
    username,
    email,
    password
  );
  
  users.push(newUser);
  saveUsers(users);
  
  const currentUser = {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    createdAt: newUser.createdAt
  };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  
  return { success: true, user: currentUser };
};

// Connexion
export const login = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return { success: false, error: 'Email ou mot de passe incorrect' };
  }
  
  const currentUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  
  return { success: true, user: currentUser };
};

// Déconnexion
export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Récupérer l'utilisateur courant
export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Récupérer les données complètes d'un utilisateur
export const getUserData = (userId) => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return null;
  
  const { password, ...userData } = user;
  return userData;
};

// Récupérer les stats d'un utilisateur
export const getUserStats = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return { completed: 0, points: 0, streak: 0 };
  
  const users = getUsers();
  const user = users.find(u => u.id === currentUser.id);
  
  // Calculer le streak correctement
  let streak = user?.stats?.streak || 0;
  
  // Vérifier l'activité récente
  const lastActivity = user?.stats?.lastActivity;
  if (lastActivity) {
    const lastDate = new Date(lastActivity);
    const today = new Date();
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak = Math.max(streak, 1);
    } else if (diffDays > 1) {
      streak = 0;
    }
  }
  
  return {
    completed: user?.completedExercises?.length || 0,
    points: (user?.completedExercises?.length || 0) * 10,
    streak: streak
  };
};

// Récupérer les exercices complétés
export const getCompletedExercises = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  
  const users = getUsers();
  const user = users.find(u => u.id === currentUser.id);
  
  return user?.completedExercises || [];
};

// Récupérer les exercices (depuis le JSON)
export const getExercises = async () => {
  try {
    const response = await fetch('/data/exercises.json');
    const data = await response.json();
    return data.exercises;
  } catch (error) {
    console.error('Erreur chargement exercices:', error);
    return [];
  }
};

// Sauvegarder une solution
export const saveUserSolution = (exerciseId, code) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  const users = getUsers();
  const index = users.findIndex(u => u.id === currentUser.id);
  
  if (index === -1) return false;
  
  if (!users[index].solutions) users[index].solutions = {};
  users[index].solutions[exerciseId] = code;
  
  saveUsers(users);
  return true;
};

// Récupérer une solution
export const getUserSolution = (exerciseId) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;
  
  const users = getUsers();
  const user = users.find(u => u.id === currentUser.id);
  
  return user?.solutions?.[exerciseId] || null;
};

// Marquer un exercice comme complété
export const markUserExerciseCompleted = (exerciseId, code) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  const users = getUsers();
  const index = users.findIndex(u => u.id === currentUser.id);
  
  if (index === -1) return false;
  
  const alreadyCompleted = users[index].completedExercises?.some(e => e.id === exerciseId);
  
  if (!alreadyCompleted) {
    if (!users[index].completedExercises) users[index].completedExercises = [];
    users[index].completedExercises.push({
      id: exerciseId,
      completedAt: new Date().toISOString(),
      code
    });
    
    // Mettre à jour les stats
    users[index].stats = {
      completed: users[index].completedExercises.length,
      points: users[index].completedExercises.length * 10,
      streak: users[index].stats?.streak || 1,
      lastActivity: new Date().toISOString()
    };
    
    saveUsers(users);
  }
  
  return true;
};

// Réinitialiser toutes les données
export const resetAllData = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  const users = getUsers();
  const index = users.findIndex(u => u.id === currentUser.id);
  
  if (index === -1) return false;
  
  // Réinitialiser les données de l'utilisateur
  users[index].completedExercises = [];
  users[index].solutions = {};
  users[index].stats = {
    completed: 0,
    points: 0,
    streak: 0,
    lastActivity: null
  };
  
  saveUsers(users);
  return true;
};