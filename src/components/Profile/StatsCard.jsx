import React from 'react';
import Card from '../UI/Card';

const StatsCard = ({ stats }) => {
  const statItems = [
    { label: 'Exercices résolus', value: stats.completed, icon: 'fa-check-circle', color: 'text-green-500' },
    { label: 'Points totaux', value: stats.points, icon: 'fa-star', color: 'text-yellow-500' },
    { label: 'Streak actuel', value: `${stats.streak} jours`, icon: 'fa-fire', color: 'text-orange-500' },
    { label: 'Niveau', value: stats.level, icon: 'fa-chart-line', color: 'text-purple-500' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <Card key={index} className="text-center p-4">
          <i className={`fas ${item.icon} ${item.color} text-3xl mb-2`}></i>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
        </Card>
      ))}
    </div>
  );
};

export default StatsCard;