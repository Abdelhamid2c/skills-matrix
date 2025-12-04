/**
 * QuestionnaireReadOnly - Affichage du questionnaire en mode lecture seule
 */

import React, { useState } from 'react';
import { scoreScale } from '../assets/questions';
import { decodeFirebaseKey } from '../utils/firebaseKeyEncoder';

const QuestionnaireReadOnly = ({ currentUser, questionnaireData, onBack, onEdit }) => {
  const { results, submittedAt, lastSaved, isComplete } = questionnaireData;
  const [expandedCategories, setExpandedCategories] = useState({});

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        console.warn('Date invalide:', dateString);
        return 'Date invalide';
      }

      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Erreur formatage date:', error);
      return 'Date invalide';
    }
  };

  const displayDate = submittedAt || lastSaved;
  const formattedDate = formatDate(displayDate);

  // Obtenir le label du score
  const getScoreLabel = (score) => {
    const scoreInfo = scoreScale.find(s => s.value === score);
    return scoreInfo ? scoreInfo.label : 'Non évalué';
  };

  // Obtenir la couleur du score
  const getScoreColor = (score) => {
    const scoreInfo = scoreScale.find(s => s.value === score);
    return scoreInfo ? scoreInfo.color : 'bg-gray-100 text-gray-800';
  };

  // Toggle catégorie
  const toggleCategory = (categoryPath) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryPath]: !prev[categoryPath]
    }));
  };

  // Modifier une compétence spécifique
  const handleEditSkill = (categoryPath, skillName) => {
    console.log('✏️ Modification de la compétence:', categoryPath, skillName);

    if (onEdit) {
      // Passer les informations de la compétence à modifier
      onEdit({
        categoryPath,
        skillName,
        editMode: 'single' // Mode modification d'une seule compétence
      });
    }
  };

  // Modifier toutes les compétences
  const handleEditAll = () => {
    console.log('✏️ Modification complète du questionnaire');

    if (onEdit) {
      onEdit({
        editMode: 'all' // Mode modification complète
      });
    }
  };

  // Calculer les statistiques
  const calculateStats = () => {
    let totalSkills = 0;
    let answeredSkills = 0;
    let unansweredSkills = 0;

    const processCategory = (data) => {
      if (!data) return;

      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          if (typeof Object.values(value)[0] === 'number') {
            // C'est une catégorie de compétences
            Object.entries(value).forEach(([skillName, score]) => {
              totalSkills++;
              // Vérifier si le score est -1, null ou undefined
              if (score === -1 || score === null || score === undefined) {
                unansweredSkills++;
              } else {
                answeredSkills++;
              }
            });
          } else {
            // C'est une sous-catégorie
            processCategory(value);
          }
        }
      });
    };

    processCategory(results);

    // Le questionnaire est complet si toutes les compétences ont une réponse
    const isReallyComplete = unansweredSkills === 0 && totalSkills > 0;

    return {
      totalSkills,
      answeredSkills,
      unansweredSkills,
      isReallyComplete
    };
  };

  const stats = calculateStats();
  const completionPercentage = stats.totalSkills > 0
    ? Math.round((stats.answeredSkills / stats.totalSkills) * 100)
    : 0;

  // Utiliser la vérification locale plutôt que isComplete du backend
  const actuallyComplete = stats.isReallyComplete;

  // Rendu récursif des catégories et compétences
  const renderCategory = (categoryName, categoryData, level = 0, parentPath = []) => {
    const decodedCategoryName = decodeFirebaseKey(categoryName);
    const currentPath = [...parentPath, categoryName].join('.');
    const isExpanded = expandedCategories[currentPath];

    // Si c'est un objet contenant directement des compétences (scores numériques)
    if (typeof Object.values(categoryData)[0] === 'number') {
      return (
        <div key={currentPath} className={`mb-4 ${level > 0 ? 'ml-6' : ''}`}>
          <button
            onClick={() => toggleCategory(currentPath)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 border-2 border-gray-200"
          >
            <div className="flex items-center">
              <span className={`font-semibold text-gray-900 ${level === 0 ? 'text-lg' : 'text-base'}`}>
                {decodedCategoryName}
              </span>
              <span className="ml-3 text-sm text-gray-600">
                ({Object.keys(categoryData).length} compétences)
              </span>
            </div>
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                isExpanded ? 'transform rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isExpanded && (
            <div className="mt-2 space-y-2 ml-4">
              {Object.entries(categoryData).map(([skillName, score]) => {
                const decodedSkillName = decodeFirebaseKey(skillName);
                const isUnanswered = score === -1 || score === null || score === undefined;

                return (
                  <div
                    key={skillName}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${
                      isUnanswered
                        ? 'bg-red-50 border-red-300'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                        isUnanswered ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {Object.keys(categoryData).indexOf(skillName) + 1}
                      </span>
                      <span className="text-gray-900 font-medium">{decodedSkillName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${
                          isUnanswered
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : getScoreColor(score) + ' border-transparent'
                        }`}
                      >
                        {isUnanswered ? '❌ Non rempli' : getScoreLabel(score)}
                      </span>

                      {/* Bouton Modifier pour cette compétence */}
                      <button
                        onClick={() => handleEditSkill([...parentPath, categoryName], skillName)}
                        className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center ${
                          isUnanswered
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                        title={isUnanswered ? 'Compléter' : 'Modifier'}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {isUnanswered ? 'Compléter' : 'Modifier'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Si c'est une sous-catégorie
    return (
      <div key={currentPath} className={`mb-4 ${level > 0 ? 'ml-6' : ''}`}>
        <button
          onClick={() => toggleCategory(currentPath)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 rounded-lg transition-all duration-200 border-2 border-gray-300"
        >
          <span className={`font-bold text-gray-900 ${level === 0 ? 'text-xl' : 'text-lg'}`}>
            {decodedCategoryName}
          </span>
          <svg
            className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${
              isExpanded ? 'transform rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpanded && (
          <div className="mt-3">
            {Object.entries(categoryData).map(([subKey, subValue]) =>
              renderCategory(subKey, subValue, level + 1, [...parentPath, categoryName])
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="card">
        {/* En-tête */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="w-2 h-8 bg-yazaki-red rounded-full mr-3"></span>
              Questionnaire de Compétences
            </h2>
            {currentUser && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Collaborateur</p>
                <p className="text-lg font-bold text-yazaki-red">{currentUser.matricule}</p>
                <p className="text-sm text-gray-600">{currentUser.firstName} {currentUser.lastName}</p>
              </div>
            )}
          </div>

          {/* Badge de statut - Utiliser actuallyComplete */}
          <div className="flex items-center gap-3 mb-4">
            {actuallyComplete ? (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800 border-2 border-green-300">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                ✅ QUESTIONNAIRE COMPLÉTÉ
              </span>
            ) : (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-orange-100 text-orange-800 border-2 border-orange-300">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                ⚠️ QUESTIONNAIRE INCOMPLET
              </span>
            )}

            <span className="text-sm text-gray-600">
              {actuallyComplete ? (
                <>
                  <strong>Complété le :</strong> {formattedDate}
                </>
              ) : (
                <>
                  <strong>Dernière sauvegarde :</strong> {formattedDate}
                </>
              )}
            </span>
          </div>

          {/* Statistiques avec alerte si incomplet */}
          <div className={`border-l-4 rounded-lg p-4 ${
            actuallyComplete
              ? 'bg-green-50 border-green-500'
              : 'bg-orange-50 border-orange-500'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold mb-1 ${
                  actuallyComplete ? 'text-green-900' : 'text-orange-900'
                }`}>
                  Progression
                </p>
                <p className={`text-xs ${
                  actuallyComplete ? 'text-green-700' : 'text-orange-700'
                }`}>
                  {stats.answeredSkills} / {stats.totalSkills} compétences évaluées
                  {stats.unansweredSkills > 0 && (
                    <span className="ml-2 text-red-600 font-bold">
                      ({stats.unansweredSkills} non remplies)
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${
                  actuallyComplete ? 'text-green-900' : 'text-orange-900'
                }`}>
                  {completionPercentage}%
                </p>
              </div>
            </div>
            <div className={`w-full rounded-full h-2 mt-3 ${
              actuallyComplete ? 'bg-green-200' : 'bg-orange-200'
            }`}>
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  actuallyComplete ? 'bg-green-600' : 'bg-orange-600'
                }`}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Vos Compétences</h3>

          {results && Object.entries(results).map(([categoryName, categoryData]) =>
            renderCategory(categoryName, categoryData)
          )}
        </div>

        {/* Boutons d'action - Afficher "Modifier Tout" même si complet mais avec des non réponses */}
        <div className="pt-6 border-t border-gray-200 mt-8">
          {!actuallyComplete && onEdit ? (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Retour à l'accueil
              </button>

              <button
                type="button"
                onClick={() => onEdit({ editMode: 'all' })}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Compléter le questionnaire
              </button>
            </div>
          ) : (
            onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Retour à l'accueil
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireReadOnly;
