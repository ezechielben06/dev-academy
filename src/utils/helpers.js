// Formate une date
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Tronque un texte
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Debounce pour les recherches
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Valide du code JavaScript
export const validateCode = (code) => {
  try {
    new Function(code);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

// Calcule la complexité d'un exercice
export const getComplexity = (difficulty) => {
  const complexities = {
    easy: { label: 'Simple', color: 'text-green-500' },
    medium: { label: 'Moyenne', color: 'text-yellow-500' },
    hard: { label: 'Complexe', color: 'text-red-500' }
  };
  return complexities[difficulty];
};