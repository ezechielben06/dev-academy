import React from 'react';
import Card from '../UI/Card';

const BadgesList = ({ badges }) => {
  const badgeColors = {
    gold: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    silver: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400',
    bronze: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
  };

  if (badges.length === 0) {
    return (
      <Card>
        <h3 className="text-xl font-semibold mb-4">Badges gagnés</h3>
        <div className="text-center py-8">
          <i className="fas fa-medal text-6xl text-gray-400 mb-3"></i>
          <p className="text-gray-600 dark:text-gray-400">Aucun badge pour le moment</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Continuez à résoudre des exercices pour gagner des badges !
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <i className="fas fa-medal mr-2 text-yellow-500"></i>
        Badges gagnés ({badges.length})
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <div key={index} className={`p-4 rounded-xl text-center ${badgeColors[badge.rarity]}`}>
            <i className={`fas ${badge.icon} text-3xl mb-2`}></i>
            <h4 className="font-semibold text-sm">{badge.name}</h4>
            <p className="text-xs mt-1 opacity-75">{badge.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BadgesList;