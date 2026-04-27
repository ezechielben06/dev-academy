import React, { useEffect } from 'react';

const Notification = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: { bg: 'bg-green-500', icon: 'fa-check-circle', text: 'Succès' },
    error: { bg: 'bg-red-500', icon: 'fa-exclamation-circle', text: 'Erreur' },
    info: { bg: 'bg-blue-500', icon: 'fa-info-circle', text: 'Info' },
    warning: { bg: 'bg-yellow-500', icon: 'fa-exclamation-triangle', text: 'Attention' }
  };

  const current = config[type];

  return (
    <div className={`fixed top-20 right-4 z-50 ${current.bg} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-up`}>
      <i className={`fas ${current.icon} text-xl`}></i>
      <div>
        <p className="font-semibold text-sm">{current.text}</p>
        <p className="text-sm">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 hover:opacity-70">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Notification;