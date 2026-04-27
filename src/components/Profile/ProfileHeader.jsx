import React from 'react';
import Card from '../UI/Card';

const ProfileHeader = ({ userProfile }) => {
  return (
    <Card className="text-center">
      <div className="relative inline-block">
        <div className="w-32 h-32 mx-auto gradient-bg rounded-full flex items-center justify-center text-white text-5xl shadow-xl">
          {userProfile.avatar}
        </div>
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-900"></div>
      </div>
      
      <h2 className="text-2xl font-bold mt-4 gradient-text">{userProfile.username}</h2>
      <p className="text-gray-600 dark:text-gray-400">{userProfile.email}</p>
      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
        <i className="fas fa-calendar-alt mr-1"></i>
        Membre depuis {userProfile.joinDate}
      </p>
    </Card>
  );
};

export default ProfileHeader;