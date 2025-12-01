/**
 * Loading - Page de chargement après connexion réussie
 */

import React from 'react';

const Loading = ({ userName }) => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full animate-fade-in">
        <div className="card text-center">
          {/* Animation de chargement */}
          <div className="mb-8">
            <div className="relative mx-auto w-32 h-32">
              {/* Cercle extérieur animé */}
              <div className="absolute inset-0 border-8 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-transparent border-t-yazaki-red rounded-full animate-spin"></div>

              {/* Logo Yazaki au centre */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yazaki-red to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Titre */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            En cours...
          </h2>

          {/* Message personnalisé */}
          {userName && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Connexion réussie !
              </p>
              <p className="text-sm text-green-700 mt-2">
                Bienvenue, <span className="font-bold">{userName}</span>
              </p>
            </div>
          )}

          {/* Message de chargement */}
          <p className="text-gray-600 mb-2">
            Préparation de votre espace de travail
          </p>

          {/* Points de chargement animés */}
          <div className="flex justify-center space-x-2 mb-6">
            <div className="w-3 h-3 bg-yazaki-red rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-3 h-3 bg-yazaki-red rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-yazaki-red rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>

          {/* Barre de progression */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yazaki-red to-red-600 rounded-full animate-progress"></div>
          </div>

          {/* Message informatif */}
          <p className="text-xs text-gray-500 mt-6">
            Veuillez patienter pendant le chargement des données...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
