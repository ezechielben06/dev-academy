import React, { useState } from 'react';

const ExerciseDescription = ({ exercise }) => {
  const [copied, setCopied] = useState(false);

  const copyExample = (example) => {
    navigator.clipboard.writeText(example.input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="card-glass p-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-align-left text-white text-xs"></i>
          </div>
          Description
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {exercise.description}
        </p>
      </div>

      {/* Exemples avec bouton de copie */}
      <div className="card-glass p-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-code text-white text-xs"></i>
          </div>
          Exemples
        </h3>
        <div className="space-y-3">
          {exercise.examples.map((example, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 group">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-sm text-purple-600 dark:text-purple-400">
                  Exemple {idx + 1}
                </span>
                <button
                  onClick={() => copyExample(example)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-500 hover:text-purple-600"
                >
                  <i className="far fa-copy mr-1"></i> Copier
                </button>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-gray-500">Entrée :</span>
                  <pre className="mt-1 bg-gray-900 text-green-400 p-2 rounded-lg text-sm font-mono overflow-x-auto">
                    {example.input}
                  </pre>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Sortie attendue :</span>
                  <pre className="mt-1 bg-gray-900 text-yellow-400 p-2 rounded-lg text-sm font-mono overflow-x-auto">
                    {example.output}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
        {copied && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg text-sm animate-fade-up">
            <i className="fas fa-check mr-2"></i>Exemple copié !
          </div>
        )}
      </div>

      {/* Code de départ */}
      <div className="card-glass p-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-rocket text-white text-xs"></i>
          </div>
          Code de départ
        </h3>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl font-mono text-sm overflow-x-auto">
          <code>{exercise.starterCode}</code>
        </pre>
      </div>
    </div>
  );
};

export default ExerciseDescription;