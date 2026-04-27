import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#1a1a2e] border-t border-gray-200 dark:border-white/10 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-terminal text-white text-sm"></i>
              </div>
              <span className="text-lg font-bold gradient-text">CodeArena</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              La plateforme d'exercices de code nouvelle génération.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm">Accueil</Link></li>
              <li><Link to="/solved" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm">Exercices résolus</Link></li>
              <li><Link to="/profile" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm">Profil</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Ressources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Suivez-nous</h3>
            <div className="flex space-x-3">
              {['github', 'twitter', 'discord', 'linkedin'].map((social) => (
                <a key={social} href="#" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-purple-100 dark:hover:bg-purple-600/20 transition-all">
                  <i className={`fab fa-${social} text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-white/10 mt-8 pt-8 text-center text-gray-500 dark:text-gray-500 text-sm">
          <p>&copy; {currentYear} CodeArena. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;