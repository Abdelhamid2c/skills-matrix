/**
 * Composant Header
 * Affiche l'en-tête de l'application avec le logo et le titre
 */

import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo et titre */}
          <div className="flex items-center gap-4">
            {/* Icône représentant la matrice de compétences */}
            <div className="w-12 h-12 bg-gradient-to-br from-yazaki-primary to-yazaki-secondary rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>

            {/* Titre de l'application */}
            <div>
              <h1 className="text-2xl font-bold text-yazaki-dark">
                Skills Matrix
              </h1>
              <p className="text-sm text-gray-500">
                Gestion des compétences
              </p>
            </div>
          </div>

          {/* Badge Yazaki */}
          <div className="hidden sm:flex items-center gap-2 bg-yazaki-light px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-yazaki-dark">Yazaki Morocco</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
