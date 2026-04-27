import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ExerciseList from '../components/Exercises/ExerciseList';
import ExerciseFilters from '../components/Exercises/ExerciseFilters';
import { getExercises, getUserStats } from '../services/exerciseService';

const HomePage = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [filters, setFilters] = useState({ difficulty: 'all', search: '' });
  const [userStats, setUserStats] = useState({ completed: 0, points: 0, streak: 0 });
  const [featuredExercises, setFeaturedExercises] = useState([]);
  const heroRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await getExercises();
      setExercises(data);
      setFilteredExercises(data);
      setFeaturedExercises(data.slice(0, 3));
      const stats = getUserStats();
      setUserStats(stats);
    };
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...exercises];
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(ex => ex.difficulty === filters.difficulty);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(ex => 
        ex.title.toLowerCase().includes(searchLower) ||
        ex.description.toLowerCase().includes(searchLower) ||
        ex.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    setFilteredExercises(filtered);
  }, [filters, exercises]);

  const features = [
    { icon: 'fa-brain', title: 'Défis intelligents', desc: 'Algorithmes progressifs adaptés à votre niveau', color: 'from-purple-500 to-pink-500', stat: '500+ exercices' },
    { icon: 'fa-chart-line', title: 'Suivi avancé', desc: 'Statistiques détaillées pour visualiser vos progrès', color: 'from-blue-500 to-cyan-500', stat: 'Statistiques en temps réel' },
    { icon: 'fa-users', title: 'Communauté', desc: 'Échangez et comparez vos solutions avec d\'autres développeurs', color: 'from-green-500 to-emerald-500', stat: '10k+ membres' },
    { icon: 'fa-trophy', title: 'Badges exclusifs', desc: 'Débloquez des récompenses en relevant des défis', color: 'from-yellow-500 to-orange-500', stat: '15 badges' },
    { icon: 'fa-rocket', title: 'Performance', desc: 'IDE intégré avec exécution instantanée du code', color: 'from-red-500 to-rose-500', stat: 'Exécution < 1s' },
    { icon: 'fa-shield-alt', title: 'Sauvegarde', desc: 'Votre progression est automatiquement sauvegardée', color: 'from-indigo-500 to-purple-500', stat: '100% sécurisé' },
  ];

  const testimonials = [
    { name: 'Thomas Martin', role: 'Développeur Fullstack', avatar: '👨‍💻', content: 'CodeArena m\'a permis de progresser rapidement grâce aux exercices bien conçus.', rating: 5 },
    { name: 'Sophie Dubois', role: 'Étudiante en informatique', avatar: '👩‍🎓', content: 'Les exercices sont variés et les astuces m\'ont beaucoup aidée !', rating: 5 },
    { name: 'Lucas Bernard', role: 'Développeur Junior', avatar: '🧑‍💻', content: 'La plateforme est super intuitive, j\'adore la sauvegarde automatique.', rating: 4 },
  ];

  const stats = [
    { value: userStats.completed, label: 'Exercices résolus', icon: 'fa-check-circle', color: 'text-green-500' },
    { value: userStats.points, label: 'Points gagnés', icon: 'fa-star', color: 'text-yellow-500' },
    { value: `${userStats.streak} jours`, label: 'Streak actuel', icon: 'fa-fire', color: 'text-orange-500' },
    { value: '100%', label: 'Taux de satisfaction', icon: 'fa-heart', color: 'text-red-500' },
  ];

  const difficultyDistribution = [
    { level: 'Facile', count: exercises.filter(e => e.difficulty === 'easy').length, color: 'bg-green-500', percentage: (exercises.filter(e => e.difficulty === 'easy').length / exercises.length) * 100 },
    { level: 'Moyen', count: exercises.filter(e => e.difficulty === 'medium').length, color: 'bg-yellow-500', percentage: (exercises.filter(e => e.difficulty === 'medium').length / exercises.length) * 100 },
    { level: 'Difficile', count: exercises.filter(e => e.difficulty === 'hard').length, color: 'bg-red-500', percentage: (exercises.filter(e => e.difficulty === 'hard').length / exercises.length) * 100 },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section améliorée */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-custom text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-8 animate-fade-up">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-500">🔥 Plus de 500 apprenants actifs cette semaine</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Maîtrisez l'art du{' '}
            <span className="gradient-text">Code</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Rejoignez une communauté de développeurs passionnés et progressez à votre rythme
            avec des exercices pratiques et un suivi personnalisé.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="#exercises">
              <button className="btn-primary text-lg">
                <i className="fas fa-play mr-2"></i>
                Commencer gratuitement
              </button>
            </Link>
            <button className="btn-secondary text-lg">
              <i className="fas fa-video mr-2"></i>
              Regarder la démo
            </button>
          </div>

          {/* Stats personnelles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto pt-8 border-t border-white/10 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <i className={`fas ${stat.icon} ${stat.color} text-2xl mb-2`}></i>
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Exercises Section */}
      <section className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Exercices populaires</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Découvrez les défis les plus appréciés par notre communauté
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredExercises.map((exercise, idx) => (
            <Link key={exercise.id} to={`/exercise/${exercise.id}`}>
              <div className="card-glass p-6 group cursor-pointer animate-fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-star text-white text-sm"></i>
                  </div>
                  <span className="text-sm text-gray-500">Populaire</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{exercise.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{exercise.description.substring(0, 80)}...</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-users text-xs text-gray-400"></i>
                    <span className="text-xs text-gray-500">1.2k résolutions</span>
                  </div>
                  <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">Découvrir →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Statistics & Progress Section */}
      <section className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Difficulty Distribution */}
          <div className="card-glass p-8">
            <h3 className="text-2xl font-bold mb-6 gradient-text">Distribution des exercices</h3>
            <div className="space-y-4">
              {difficultyDistribution.map((diff, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{diff.level}</span>
                    <span className="text-sm text-gray-500">{diff.count} exercices</span>
                  </div>
                  <div className="relative h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`absolute left-0 top-0 h-full ${diff.color} rounded-full transition-all duration-500`}
                      style={{ width: `${diff.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Challenge */}
          <div className="card-glass p-8 bg-gradient-to-br from-purple-600/10 to-pink-600/10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold gradient-text mb-2">Défi de la semaine</h3>
                <p className="text-gray-400">Gagnez des points bonus</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-trophy text-white text-xl"></i>
              </div>
            </div>
            <p className="text-gray-300 mb-4">Complétez 3 exercices cette semaine pour débloquer un badge exclusif !</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fas fa-clock text-gray-400"></i>
                <span className="text-sm text-gray-400">Plus que 5 jours</span>
              </div>
              <button className="text-purple-600 dark:text-purple-400 font-semibold text-sm">Participer →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Pourquoi nous choisir ?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Une plateforme complète pour booster vos compétences en programmation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="card-glass p-6 group hover:scale-105 transition-all duration-300">
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <i className={`fas ${feature.icon} text-white text-xl`}></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{feature.desc}</p>
              <div className="flex items-center gap-2">
                <i className="fas fa-chart-line text-xs text-gray-400"></i>
                <span className="text-xs text-gray-500">{feature.stat}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Ce qu'en disent nos utilisateurs</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Rejoignez une communauté de développeurs satisfaits
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="card-glass p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <i key={i} className="fas fa-star text-yellow-500 text-sm"></i>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom">
        <div className="card-glass p-12 text-center bg-gradient-to-r from-purple-600/20 to-pink-600/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Prêt à relever le défi ?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Rejoignez des milliers de développeurs qui améliorent leurs compétences chaque jour sur CodeArena
          </p>
          <Link to="#exercises">
            <button className="btn-primary text-lg">
              <i className="fas fa-rocket mr-2"></i>
              Commencer maintenant
            </button>
          </Link>
        </div>
      </section>

      {/* Exercises Catalogue */}
      <section id="exercises" className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Catalogue d'exercices</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explorez notre bibliothèque de {exercises.length} défis soigneusement sélectionnés
          </p>
        </div>
        
        <ExerciseFilters filters={filters} onFilterChange={setFilters} />
        <ExerciseList exercises={filteredExercises} />
      </section>
    </div>
  );
};

export default HomePage;