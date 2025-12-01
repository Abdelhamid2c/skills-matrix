/**
 * Questionnaire - Page du questionnaire de compétences
 */

import React from 'react';

const Questionnaire = ({ currentUser, onBack }) => {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="card">
        {/* En-tête du questionnaire */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="w-2 h-8 bg-yazaki-red rounded-full mr-3"></span>
              Questionnaire de Compétences
            </h2>
            {currentUser && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Connecté en tant que</p>
                <p className="text-lg font-bold text-yazaki-red">{currentUser.matricule}</p>
              </div>
            )}
          </div>
          <p className="text-gray-600 ml-5">
            Évaluez vos compétences techniques et professionnelles
          </p>
        </div>

        {/* Zone de contenu - À développer */}
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center py-16">
          {/* Icône */}
          <div className="w-32 h-32 bg-gradient-to-br from-yazaki-red to-red-600 rounded-full flex items-center justify-center mb-8 shadow-2xl">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          {/* Message */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Questionnaire en Développement
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl">
            Cette section contiendra le questionnaire d'évaluation des compétences.
            Le contenu sera développé prochainement.
          </p>

          {/* Informations à venir */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-yazaki-red rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Compétences Techniques</h4>
              <p className="text-sm text-gray-600">Évaluation des compétences métier</p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-yazaki-red rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Compétences Soft Skills</h4>
              <p className="text-sm text-gray-600">Évaluation des compétences comportementales</p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-yazaki-red rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Résultats & Analyse</h4>
              <p className="text-sm text-gray-600">Visualisation des résultats</p>
            </div>
          </div>

          {/* Note informative */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex">
              <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Information</h4>
                <p className="text-sm text-blue-800">
                  Le questionnaire d'évaluation des compétences sera disponible prochainement.
                  Il permettra une évaluation complète et structurée de vos compétences professionnelles.
                </p>
              </div>
            </div>
          </div>

          {/* Bouton retour */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mt-8 px-8 py-3 bg-white text-yazaki-red border-2 border-yazaki-red rounded-lg font-semibold hover:bg-yazaki-red hover:text-white transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour à l'accueil
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
