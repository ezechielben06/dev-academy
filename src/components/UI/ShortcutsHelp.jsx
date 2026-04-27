import React, { useState } from 'react';

const ShortcutsHelp = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow(!show)}
        className="fixed bottom-4 right-4 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:scale-110 transition-all z-40"
      >
        <i className="fas fa-keyboard"></i>
      </button>
      
      {show && (
        <div className="fixed bottom-20 right-4 card-glass p-4 z-40 w-64 animate-fade-up">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-sm">Raccourcis clavier</h4>
            <button onClick={() => setShow(false)} className="text-gray-500">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Exécuter le code</span>
              <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-white/10 rounded text-xs">Ctrl + Enter</kbd>
            </div>
            <div className="flex justify-between">
              <span>Sauvegarder</span>
              <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-white/10 rounded text-xs">Ctrl + S</kbd>
            </div>
            <div className="flex justify-between">
              <span>Indentation</span>
              <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-white/10 rounded text-xs">Tab</kbd>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShortcutsHelp;