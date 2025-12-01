/**
 * Welcome - Page d'accueil de l'application Skills Matrix
 */

import React from 'react';

const Welcome = ({ onGetStarted }) => {

  const handleGetStartedClick = (e) => {
    e.preventDefault();
    console.log('Bouton Commencer cliqué');
    if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        {/* Contenu principal */}
        <div className="text-center mb-12 animate-fade-in">
          {/* Titre principal */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenue sur
            <span className="block text-yazaki-red mt-2">Skills Matrix</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plateforme de gestion et d'évaluation des compétences pour Yazaki Morocco Meknes
          </p>

          {/* Bouton CTA */}
          <button
            type="button"
            onClick={handleGetStartedClick}
            className="inline-flex items-center px-8 py-4 bg-yazaki-red text-white text-lg font-semibold rounded-lg hover:bg-yazaki-dark-red transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Commencer
            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 animate-slide-in">
            <div className="w-16 h-16 bg-gradient-to-br from-yazaki-red to-red-600 rounded-lg flex items-center justify-center mb-6 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Gestion des Profils
            </h3>
            <p className="text-gray-600">
              Créez et gérez les profils de vos collaborateurs avec toutes leurs informations professionnelles.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 animate-slide-in" style={{animationDelay: '0.1s'}}>
            <div className="w-16 h-16 bg-gradient-to-br from-yazaki-red to-red-600 rounded-lg flex items-center justify-center mb-6 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Évaluation des Compétences
            </h3>
            <p className="text-gray-600">
              Évaluez et suivez l'évolution des compétences techniques de vos équipes en temps réel.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 animate-slide-in" style={{animationDelay: '0.2s'}}>
            <div className="w-16 h-16 bg-gradient-to-br from-yazaki-red to-red-600 rounded-lg flex items-center justify-center mb-6 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Rapports Détaillés
            </h3>
            <p className="text-gray-600">
              Générez des rapports complets et visualisez les statistiques de compétences de votre organisation.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-yazaki-red to-red-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">Collaborateurs</div>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-90">Compétences Évaluées</div>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.5s'}}>
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="text-lg opacity-90">Départements</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
