import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../components/UI/CodeEditor';
import Notification from '../components/UI/Notification';
import { getExerciseById, saveSolution, getSavedSolution, markAsCompleted, getCompletedExercises, getUserStats } from '../services/exerciseService';
import { loadPyodide } from 'pyodide';

const ExercisePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [showDescription, setShowDescription] = useState(true);
  const [navigationExercises, setNavigationExercises] = useState({ prev: null, next: null });
  const [pyodide, setPyodide] = useState(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);

  // Initialiser Pyodide
  useEffect(() => {
    const initPyodide = async () => {
      setIsPyodideLoading(true);
      try {
        const pyodideInstance = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        });
        setPyodide(pyodideInstance);
        setPyodideReady(true);
        console.log("Pyodide chargé avec succès");
      } catch (error) {
        console.error("Erreur chargement Pyodide:", error);
        setNotification({
          message: "⚠️ Pyodide n'a pas pu être chargé. L'exécution Python sera limitée.",
          type: "warning"
        });
      } finally {
        setIsPyodideLoading(false);
      }
    };
    initPyodide();
  }, []);

  useEffect(() => {
    const loadExercise = async () => {
      const exerciseData = await getExerciseById(parseInt(id));
      if (exerciseData) {
        setExercise(exerciseData);
        const savedCode = getSavedSolution(parseInt(id));
        setCode(savedCode || exerciseData.starterCode);
        setIsSaved(!!savedCode);
        const completed = getCompletedExercises();
        setIsCompleted(completed.some(c => c.id === parseInt(id)));
        const stats = getUserStats();
        setUserPoints(stats.points);
        
        const { getExercises } = await import('../services/exerciseService');
        const allExercises = await getExercises();
        const currentIndex = allExercises.findIndex(e => e.id === parseInt(id));
        setNavigationExercises({
          prev: currentIndex > 0 ? allExercises[currentIndex - 1] : null,
          next: currentIndex < allExercises.length - 1 ? allExercises[currentIndex + 1] : null
        });
      } else {
        navigate('/404');
      }
    };
    loadExercise();
  }, [id, navigate]);

  // Fonction pour exécuter du code Python avec Pyodide
  const runPythonCode = useCallback(async (pythonCode) => {
    if (!pyodideReady) {
      return {
        success: false,
        output: "",
        error: "Pyodide n'est pas encore prêt. Veuillez patienter..."
      };
    }

    try {
      // Rediriger stdout pour capturer les prints
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
      `);
      
      // Exécuter le code Python
      const result = pyodide.runPython(pythonCode);
      
      // Récupérer la sortie stdout
      const stdout = pyodide.runPython("sys.stdout.getvalue()");
      const stderr = pyodide.runPython("sys.stderr.getvalue()");
      
      let outputText = stdout;
      if (result !== undefined && result !== null && stdout === "") {
        outputText = String(result);
      }
      
      if (stderr) {
        return {
          success: false,
          output: outputText,
          error: stderr
        };
      }
      
      return {
        success: true,
        output: outputText || "Code exécuté avec succès",
        error: null
      };
    } catch (error) {
      return {
        success: false,
        output: "",
        error: error.message
      };
    }
  }, [pyodide, pyodideReady]);

  // Fonction pour exécuter du code JavaScript
  const runJavaScriptCode = useCallback((jsCode) => {
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.map(arg => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg, null, 2);
        }
        return String(arg);
      }).join(' '));
      originalLog(...args);
    };
    
    try {
      const func = new Function(jsCode);
      const result = func();
      
      let outputText = logs.join('\n');
      if (result !== undefined) {
        outputText += (outputText ? '\n' : '') + `➜ Retour: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`;
      }
      
      return {
        success: true,
        output: outputText || '✓ Code exécuté avec succès',
        error: null
      };
    } catch (error) {
      return {
        success: false,
        output: "",
        error: error.message
      };
    } finally {
      console.log = originalLog;
    }
  }, []);

  const runCode = useCallback(async () => {
    if (!exercise) return;
    
    setIsRunning(true);
    setOutput('');
    setExecutionTime(null);
    
    const startTime = performance.now();
    const language = exercise.language || 'javascript';
    
    let result;
    
    if (language === 'python') {
      // Exécution Python avec Pyodide
      if (!pyodideReady && isPyodideLoading) {
        setOutput("⏳ Chargement de l'environnement Python... Veuillez patienter.");
        setIsRunning(false);
        return;
      }
      result = await runPythonCode(code);
    } else {
      // Exécution JavaScript
      result = runJavaScriptCode(code);
    }
    
    const endTime = performance.now();
    setExecutionTime((endTime - startTime).toFixed(2));
    
    if (result.success) {
      setOutput(result.output);
      
      if (!isCompleted) {
        markAsCompleted(parseInt(id));
        setIsCompleted(true);
        const newStats = getUserStats();
        setUserPoints(newStats.points);
        showNotification('🎉 Exercice complété ! +10 points', 'success');
      } else {
        showNotification('✓ Code exécuté avec succès', 'success');
      }
    } else {
      setOutput(`❌ Erreur ${language === 'python' ? 'Python' : 'JavaScript'}: ${result.error}`);
      showNotification('Erreur dans le code', 'error');
    }
    
    setIsRunning(false);
  }, [code, id, isCompleted, exercise, pyodideReady, isPyodideLoading, runPythonCode, runJavaScriptCode]);

  const saveCode = useCallback(() => {
    saveSolution(parseInt(id), code);
    setIsSaved(true);
    showNotification('💾 Code sauvegardé', 'success');
  }, [code, id]);

  const resetCode = () => {
    setCode(exercise.starterCode);
    setIsSaved(false);
    showNotification('🔄 Code réinitialisé', 'info');
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const handleRunEvent = () => runCode();
    const handleSaveEvent = () => saveCode();
    
    document.addEventListener('runCode', handleRunEvent);
    document.addEventListener('saveCode', handleSaveEvent);
    
    return () => {
      document.removeEventListener('runCode', handleRunEvent);
      document.removeEventListener('saveCode', handleSaveEvent);
    };
  }, [runCode, saveCode]);

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-purple-600"></i>
          <p className="mt-4 text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  const language = exercise.language || 'javascript';
  const isPython = language === 'python';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header fixe avec infos */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-purple-600 transition-colors"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <div>
                <h1 className="text-lg font-bold gradient-text">{exercise.title}</h1>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`badge ${
                    exercise.difficulty === 'easy' ? 'badge-easy' : 
                    exercise.difficulty === 'medium' ? 'badge-medium' : 'badge-hard'
                  }`}>
                    {exercise.difficulty === 'easy' ? 'Facile' : exercise.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <i className={`fab ${isPython ? 'fa-python text-blue-500' : 'fa-js text-yellow-500'}`}></i>
                    <span>{isPython ? 'Python' : 'JavaScript'}</span>
                  </span>
                  {isCompleted && (
                    <span className="text-green-500">
                      <i className="fas fa-check-circle mr-1"></i>Complété
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10">
                <i className="fas fa-star text-yellow-500 text-sm"></i>
                <span className="text-sm font-semibold text-yellow-500">{userPoints} pts</span>
              </div>
              {isSaved && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-sm">
                  <i className="fas fa-save"></i>
                  <span className="hidden sm:inline">Sauvegardé</span>
                </div>
              )}
              {isPython && !pyodideReady && isPyodideLoading && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-500 text-sm">
                  <i className="fas fa-spinner fa-spin"></i>
                  <span className="hidden sm:inline">Chargement Python...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar gauche - Description */}
        <div className="lg:w-96 xl:w-96 border-r border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="lg:hidden w-full px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800"
          >
            <span className="font-semibold">Description</span>
            <i className={`fas fa-chevron-${showDescription ? 'up' : 'down'}`}></i>
          </button>
          
          <div className={`${showDescription ? 'block' : 'hidden lg:block'} h-[calc(100vh-120px)] overflow-y-auto p-4 space-y-4`}>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {exercise.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {exercise.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Exemples</h3>
              <div className="space-y-3">
                {exercise.examples.map((example, idx) => (
                  <div key={idx} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Exemple {idx + 1}</div>
                    <div className="text-xs">
                      <span className="text-purple-600 dark:text-purple-400">Entrée :</span>
                      <pre className="mt-1 bg-gray-900 text-green-400 p-2 rounded text-xs overflow-x-auto">{example.input}</pre>
                    </div>
                    <div className="text-xs mt-2">
                      <span className="text-yellow-600 dark:text-yellow-400">Sortie :</span>
                      <pre className="mt-1 bg-gray-900 text-yellow-400 p-2 rounded text-xs overflow-x-auto">{example.output}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Code de départ</h3>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                {exercise.starterCode}
              </pre>
            </div>

            {exercise.hints && exercise.hints.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Astuces</h3>
                <div className="space-y-2">
                  {exercise.hints.map((hint, idx) => (
                    <div key={idx} className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                      <i className="fas fa-lightbulb text-yellow-500 text-xs mr-2"></i>
                      <span className="text-xs text-gray-700 dark:text-gray-300">{hint}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zone principale - Éditeur */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              {navigationExercises.prev && (
                <button
                  onClick={() => navigate(`/exercise/${navigationExercises.prev.id}`)}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <i className="fas fa-chevron-left mr-1"></i> Précédent
                </button>
              )}
              {navigationExercises.next && (
                <button
                  onClick={() => navigate(`/exercise/${navigationExercises.next.id}`)}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Suivant <i className="fas fa-chevron-right ml-1"></i>
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={resetCode}
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <i className="fas fa-undo-alt mr-1"></i> Réinitialiser
              </button>
              <button
                onClick={saveCode}
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <i className="fas fa-save mr-1"></i> Sauvegarder
              </button>
              <button
                onClick={runCode}
                disabled={isRunning || (isPython && !pyodideReady)}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isRunning ? (
                  <><i className="fas fa-spinner fa-spin mr-1"></i> Exécution...</>
                ) : (
                  <><i className="fas fa-play mr-1"></i> Exécuter</>
                )}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <CodeEditor value={code} onChange={setCode} language={language} />
          </div>

          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <i className="fas fa-terminal text-purple-400 text-sm"></i>
                <span className="text-sm font-medium text-gray-300">Sortie</span>
              </div>
              {executionTime && (
                <span className="text-xs text-gray-500">
                  <i className="fas fa-tachometer-alt mr-1"></i> {executionTime} ms
                </span>
              )}
            </div>
            <pre className={`p-4 font-mono text-sm overflow-x-auto min-h-[120px] max-h-[200px] overflow-y-auto ${
              output.includes('❌') ? 'text-red-400' : output.includes('✓') ? 'text-green-400' : 'text-gray-300'
            }`}>
              {output || '// Cliquez sur "Exécuter" pour voir le résultat de votre code'}
            </pre>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            <i className="fas fa-keyboard mr-1"></i>
            Raccourcis : <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">Enter</kbd> Exécuter · 
            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded ml-1">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">S</kbd> Sauvegarder · 
            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded ml-1">Tab</kbd> Indentation
          </div>
        </div>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default ExercisePage;