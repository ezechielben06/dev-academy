import React, { useEffect, useRef, useState, useCallback } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CodeEditor = ({ value, onChange, readOnly = false, language = 'javascript' }) => {
  const textareaRef = useRef(null);
  const highlighterRef = useRef(null);
  const [lineCount, setLineCount] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [fontSize] = useState(14);

  // Compter les lignes
  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
  }, [value]);

  // Mettre à jour la position du curseur
  const updateCursorPosition = useCallback(() => {
    if (textareaRef.current) {
      const text = textareaRef.current.value;
      const cursorPos = textareaRef.current.selectionStart;
      const lines = text.substring(0, cursorPos).split('\n');
      setCursorPosition({
        line: lines.length,
        col: lines[lines.length - 1].length + 1
      });
    }
  }, []);

  // Synchroniser le scroll entre textarea et highlighter
  const handleScroll = useCallback(() => {
    if (highlighterRef.current && textareaRef.current) {
      highlighterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (textareaRef.current !== document.activeElement) return;

      if (e.key === 'Tab') {
        e.preventDefault();
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newValue);
        setTimeout(() => {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
          updateCursorPosition();
        }, 0);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('runCode'));
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('saveCode'));
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown);
      textarea.addEventListener('click', updateCursorPosition);
      textarea.addEventListener('keyup', updateCursorPosition);
      textarea.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener('keydown', handleKeyDown);
        textarea.removeEventListener('click', updateCursorPosition);
        textarea.removeEventListener('keyup', updateCursorPosition);
        textarea.removeEventListener('scroll', handleScroll);
      }
    };
  }, [value, onChange, updateCursorPosition, handleScroll]);

  const handleChange = useCallback((e) => {
    onChange(e.target.value);
    setTimeout(updateCursorPosition, 0);
  }, [onChange, updateCursorPosition]);

  // Obtenir l'icône et le nom du langage
  const getLanguageIcon = () => {
    switch(language) {
      case 'python':
        return <i className="fab fa-python text-blue-500 text-sm"></i>;
      case 'javascript':
        return <i className="fab fa-js text-yellow-500 text-sm"></i>;
      default:
        return <i className="fas fa-code text-gray-500 text-sm"></i>;
    }
  };

  const getLanguageName = () => {
    switch(language) {
      case 'python':
        return 'Python';
      case 'javascript':
        return 'JavaScript';
      default:
        return language;
    }
  };

  const getLanguageVersion = () => {
    switch(language) {
      case 'python':
        return 'Python 3.11';
      case 'javascript':
        return 'JavaScript ES6+';
      default:
        return '';
    }
  };

  const getPlaceholder = () => {
    switch(language) {
      case 'python':
        return '# Écrivez votre code Python ici...\n\ndef solution():\n    pass';
      case 'javascript':
        return '// Écrivez votre code JavaScript ici...\n\nfunction solution() {\n    \n}';
      default:
        return '// Écrivez votre code ici...';
    }
  };

  // Déterminer le langage pour SyntaxHighlighter
  const highlighterLanguage = language === 'python' ? 'python' : 'javascript';

  return (
    <div className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
      isFocused ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-purple-500/30'
    }`}>
      {/* Barre d'outils */}
      <div className="bg-gray-800 dark:bg-gray-900 px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="h-4 w-px bg-gray-600"></div>
          <div className="flex items-center gap-1">
            {getLanguageIcon()}
            <span className="text-xs text-gray-400 font-mono">{getLanguageName()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <i className="fas fa-code"></i>
              <span>{lineCount} lignes</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="fas fa-map-marker-alt"></i>
              <span>{cursorPosition.line}:{cursorPosition.col}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Éditeur avec coloration syntaxique */}
      <div className="relative bg-[#1a1a2e]" style={{ minHeight: '450px' }}>
        {/* Syntax Highlighter en fond avec numéros */}
        <div 
          ref={highlighterRef}
          className="absolute inset-0 overflow-auto pointer-events-none"
        >
          <SyntaxHighlighter
            language={highlighterLanguage}
            style={atomOneDark}
            customStyle={{
              margin: 0,
              padding: '20px',
              paddingBlock:'15px',
              paddingLeft: '18px',
              background: '#1a1a2e',
              minHeight: '450px',
              fontSize: `${fontSize}px`,
              lineHeight: '1.6',
              fontFamily: 'Fira Code, Consolas, monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
            showLineNumbers={true}
            lineNumberStyle={{
              color: '#6b7280',
              minWidth: '3em',
              paddingRight: '1em',
              textAlign: 'right',
              userSelect: 'none',
              background: '#1a1a2e',
            }}
          >
            {value || getPlaceholder()}
          </SyntaxHighlighter>
        </div>
        
        {/* Textarea transparent pour l'édition */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={readOnly}
          className="relative w-full min-h-[450px] font-mono text-sm bg-transparent text-transparent caret-purple-500 resize-none focus:outline-none z-10"
          spellCheck="false"
          style={{ 
            padding: '16px',
            paddingLeft: '60px',
            lineHeight: '1.6',
            fontSize: `${fontSize}px`,
            fontFamily: 'Fira Code, Consolas, monospace',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
        />
      </div>

      {/* Barre d'état */}
      <div className="bg-gray-800 dark:bg-gray-900 px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-t border-gray-700 text-xs">
        <div className="flex items-center gap-3 text-gray-500">
          <span>UTF-8</span>
          <span>{getLanguageVersion()}</span>
          <span>Spaces: 2</span>
        </div>
        <div className="flex items-center gap-3 text-gray-500">
          <span>
            <i className="far fa-keyboard mr-1"></i>
            Ctrl+Enter: Exécuter
          </span>
          <span>
            <i className="far fa-save mr-1"></i>
            Ctrl+S: Sauvegarder
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;