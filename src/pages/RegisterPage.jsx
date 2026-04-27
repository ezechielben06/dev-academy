import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (username.length < 3) {
      setError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
      return false;
    }
    if (!acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);

    const result = register(username, email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const strength = getPasswordStrength();
  const strengthText = ['', 'Faible', 'Moyen', 'Bon', 'Excellent'];
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background animé */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo animé */}
        <div className="text-center group">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                <i className="fas fa-user-astronaut text-white text-3xl"></i>
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Rejoindre l'aventure
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Créez votre compte et commencez à coder
          </p>
        </div>

        {/* Formulaire */}
        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          {/* Message d'erreur */}
          {error && (
            <div className="rounded-2xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 backdrop-blur-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-500 text-sm"></i>
                </div>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Champs du formulaire */}
          <div className="space-y-5">
            {/* Nom d'utilisateur */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <i className="fas fa-user-astronaut mr-2 text-purple-500"></i>
                Nom d'utilisateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-user text-gray-400 group-focus-within:text-purple-500 transition-colors"></i>
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 transition-all duration-300 outline-none ${
                    focusedField === 'username' 
                      ? 'border-purple-500 ring-4 ring-purple-500/20 bg-white dark:bg-gray-900' 
                      : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm'
                  }`}
                  placeholder="CodeMaster"
                />
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <i className="fas fa-envelope mr-2 text-purple-500"></i>
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400 group-focus-within:text-purple-500 transition-colors"></i>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 transition-all duration-300 outline-none ${
                    focusedField === 'email' 
                      ? 'border-purple-500 ring-4 ring-purple-500/20 bg-white dark:bg-gray-900' 
                      : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm'
                  }`}
                  placeholder="alex@codearena.com"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <i className="fas fa-lock mr-2 text-purple-500"></i>
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-key text-gray-400 group-focus-within:text-purple-500 transition-colors"></i>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 transition-all duration-300 outline-none ${
                    focusedField === 'password' 
                      ? 'border-purple-500 ring-4 ring-purple-500/20 bg-white dark:bg-gray-900' 
                      : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-purple-500 transition-colors`}></i>
                </button>
              </div>
              
              {/* Indicateur de force */}
              {password && (
                <div className="mt-3">
                  <div className="flex gap-1 h-1.5 mb-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 rounded-full transition-all duration-500 ${
                          strength >= level ? strengthColor[strength] : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Force du mot de passe : 
                      <span className={`ml-1 font-semibold ${
                        strength === 1 ? 'text-red-500' :
                        strength === 2 ? 'text-yellow-500' :
                        strength === 3 ? 'text-blue-500' :
                        strength === 4 ? 'text-green-500' : ''
                      }`}>
                        {strengthText[strength]}
                      </span>
                    </p>
                    {strength >= 3 && (
                      <i className="fas fa-check-circle text-green-500 text-xs"></i>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Confirmation mot de passe */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <i className="fas fa-check-circle mr-2 text-purple-500"></i>
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400 group-focus-within:text-purple-500 transition-colors"></i>
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirm')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 transition-all duration-300 outline-none ${
                    focusedField === 'confirm' 
                      ? 'border-purple-500 ring-4 ring-purple-500/20 bg-white dark:bg-gray-900' 
                      : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm'
                  } ${
                    confirmPassword && password !== confirmPassword ? 'border-red-500' : 
                    confirmPassword && password === confirmPassword ? 'border-green-500' : ''
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-purple-500 transition-colors`}></i>
                </button>
                {confirmPassword && (
                  <div className="absolute inset-y-0 right-12 flex items-center">
                    <i className={`fas ${password === confirmPassword ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500'} text-sm`}></i>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Conditions d'utilisation - CORRIGÉ */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/20">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
              J'accepte les{' '}
              <Link to="/terms" className="text-purple-600 hover:text-purple-500 font-medium transition-colors" onClick={(e) => e.stopPropagation()}>
                conditions d'utilisation
              </Link>{' '}
              et la{' '}
              <Link to="/privacy" className="text-purple-600 hover:text-purple-500 font-medium transition-colors" onClick={(e) => e.stopPropagation()}>
                politique de confidentialité
              </Link>
            </label>
          </div>

          {/* Bouton d'inscription */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            {loading ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i> Création du compte...</>
            ) : (
              <><i className="fas fa-user-plus mr-2"></i> Créer mon compte</>
            )}
          </button>

          {/* Lien vers connexion */}
          <div className="text-center pt-2">
            <p className="text-gray-600 dark:text-gray-400">
              Déjà un compte ?{' '}
              <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors inline-flex items-center gap-1">
                Se connecter
                <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </p>
          </div>
        </form>

        {/* Séparateur */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-transparent text-sm text-gray-400">Ou s'inscrire avec</span>
          </div>
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="group flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300">
            <i className="fab fa-github text-xl text-gray-700 dark:text-gray-300 group-hover:text-purple-600 transition-colors"></i>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600">GitHub</span>
          </button>
          <button className="group flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300">
            <i className="fab fa-google text-xl text-gray-700 dark:text-gray-300 group-hover:text-purple-600 transition-colors"></i>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600">Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;