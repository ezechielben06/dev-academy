import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container-custom flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="relative">
        <div className="text-8xl md:text-9xl font-bold gradient-text mb-4">404</div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-3xl opacity-20"></div>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Page non trouvée</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      
      <Link to="/">
        <button className="btn-primary">
          <i className="fas fa-home mr-2"></i>
          Retour à l'accueil
        </button>
      </Link>
    </div>
  );
};

export default NotFoundPage;