/**
 * QuestionnaireReadOnly - Affichage du questionnaire en mode lecture seule
 */

import React from 'react';
import { skillsData, scoreScale } from '../assets/questions';

const QuestionnaireReadOnly = ({ currentUser, questionnaireData, onBack, onEdit }) => {
  const { results, submittedAt } = questionnaireData;

  /**
   * Vérifier si le questionnaire est complet
   */
  const isQuestionnaireComplete = () => {
    let hasUnanswered = false;

    const checkComplete = (obj) => {
      Object.values(obj).forEach(value => {
        if (typeof value === 'number' && value === -1) {
          hasUnanswered = true;
        } else if (typeof value === 'object') {
          checkComplete(value);
        }
      });
    };

    checkComplete(results);
    return !hasUnanswered;
  };

  const isComplete = isQuestionnaireComplete();

  /**
   * Obtenir la couleur du badge selon le score
   */
  const getScoreBadgeColor = (score) => {
    if (score === -1) {
      return 'bg-red-200 text-red-700 border-2 border-red-400';
    }
    const scale = scoreScale.find(s => s.value === score);
    return scale ? scale.color : 'bg-gray-200 text-gray-700';
  };

  /**
   * Obtenir le label du score
   */
  const getScoreLabel = (score) => {
    if (score === -1) {
      return 'Non répondu';
    }
    const scale = scoreScale.find(s => s.value === score);
    return scale ? scale.label : 'Non évalué';
  };

  /**
   * Formater la date de soumission
   */
  const formatSubmittedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Calculer les statistiques
   */
  const calculateStats = () => {
    let total = 0;
    let answered = 0;
    let unanswered = 0;
    let totalScore = 0;
    let byLevel = { '-1': 0, 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };

    const countScores = (obj) => {
      Object.values(obj).forEach(value => {
        if (typeof value === 'number') {
          total++;
          if (value === -1) {
            unanswered++;
            byLevel['-1']++;
          } else {
            answered++;
            totalScore += value;
            byLevel[value] = (byLevel[value] || 0) + 1;
          }
        } else if (typeof value === 'object') {
          countScores(value);
        }
      });
    };

    countScores(results);

    return {
      total,
      answered,
      unanswered,
      average: answered > 0 ? (totalScore / answered).toFixed(2) : 0,
      byLevel
    };
  };

  const stats = calculateStats();

  /**
   * Afficher la liste des compétences
   */
  const renderSkills = (categoryName, skills, categoryResults) => {
    return (
      <div key={categoryName} className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-2">
          {categoryName}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {skills.map((skillName, index) => {
            const score = categoryResults[skillName] ?? -1;
            const isUnanswered = score === -1;

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                  isUnanswered
                    ? 'bg-red-50 border-red-300'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center flex-1">
                  <span className={`flex-shrink-0 w-6 h-6 ${isUnanswered ? 'bg-red-400' : 'bg-gray-400'} text-white rounded-full flex items-center justify-center text-xs font-bold mr-3`}>
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-800">
                    {skillName}
                  </span>
                </div>
                <div className="ml-3 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getScoreBadgeColor(score)}`}>
                    {score === -1 ? '—' : score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * Afficher une catégorie et ses compétences
   */
  const renderCategory = (categoryName, categoryData, resultData, level = 0) => {
    if (!resultData) return null;

    if (typeof categoryData === 'object' && !Array.isArray(categoryData)) {
      return (
        <div key={categoryName} className={`${level > 0 ? 'ml-4' : ''} mb-6`}>
          <h3 className={`font-bold mb-3 ${level === 0 ? 'text-xl text-yazaki-red' : 'text-lg text-gray-800'}`}>
            {categoryName}
          </h3>
          <div className="space-y-4">
            {Object.entries(categoryData).map(([subKey, subData]) => {
              if (Array.isArray(subData)) {
                return renderSkills(subKey, subData, resultData[subKey] || {});
              } else {
                return renderCategory(subKey, subData, resultData[subKey] || {}, level + 1);
              }
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="card">
        {/* En-tête avec badge "Complété" ou "Incomplet" */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className={`w-2 h-8 ${isComplete ? 'bg-green-600' : 'bg-red-600'} rounded-full mr-3`}></span>
                Questionnaire de Compétences
              </h2>
              <span className={`px-4 py-2 bg-gradient-to-r ${
                isComplete
                  ? 'from-green-500 to-green-600'
                  : 'from-red-500 to-red-600'
              } text-white rounded-full text-sm font-bold shadow-lg flex items-center`}>
                {isComplete ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    COMPLÉTÉ
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    INCOMPLET
                  </>
                )}
              </span>
            </div>
            {currentUser && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Collaborateur</p>
                <p className="text-lg font-bold text-yazaki-red">{currentUser.matricule}</p>
                <p className="text-sm text-gray-600">{currentUser.firstName} {currentUser.lastName}</p>
              </div>
            )}
          </div>

          {/* Date de soumission */}
          <div className={`${isComplete ? 'bg-blue-50 border-blue-500' : 'bg-orange-50 border-orange-500'} border-l-4 rounded-lg p-4 mb-4`}>
            <div className="flex items-center">
              <svg className={`w-6 h-6 ${isComplete ? 'text-blue-600' : 'text-orange-600'} mr-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className={`text-sm ${isComplete ? 'text-blue-700' : 'text-orange-700'} font-semibold`}>
                  Questionnaire {isComplete ? 'rempli' : 'soumis partiellement'} le :
                </p>
                <p className={`text-lg font-bold ${isComplete ? 'text-blue-900' : 'text-orange-900'}`}>
                  {formatSubmittedDate(submittedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Alerte si incomplet avec bouton Modifier */}
          {!isComplete && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <svg className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="font-semibold text-red-800">
                      ⚠️ Questionnaire incomplet - {stats.unanswered} compétence{stats.unanswered > 1 ? 's' : ''} non évaluée{stats.unanswered > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-red-700">
                      Certaines compétences n'ont pas été évaluées et sont marquées comme "Non répondu"
                    </p>
                  </div>
                </div>
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="ml-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center whitespace-nowrap"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Compléter
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Statistiques globales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
              <p className="text-sm text-blue-700 font-semibold mb-1">Total Compétences</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
              <p className="text-sm text-green-700 font-semibold mb-1">Évaluées</p>
              <p className="text-3xl font-bold text-green-900">{stats.answered}</p>
            </div>
            {stats.unanswered > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border-2 border-red-200">
                <p className="text-sm text-red-700 font-semibold mb-1">Non Répondues</p>
                <p className="text-3xl font-bold text-red-900">{stats.unanswered}</p>
              </div>
            )}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-2 border-purple-200">
              <p className="text-sm text-purple-700 font-semibold mb-1">Score Moyen</p>
              <p className="text-3xl font-bold text-purple-900">{stats.average}</p>
            </div>
          </div>
        </div>

        {/* Répartition par niveau (incluant -1) */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Répartition par Niveau de Compétence
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {stats.byLevel['-1'] > 0 && (
              <div className="bg-red-200 text-red-700 border-2 border-red-400 px-4 py-3 rounded-lg text-center">
                <p className="text-xs font-medium mb-1">Non Répondu</p>
                <p className="text-2xl font-bold">{stats.byLevel['-1']}</p>
                <p className="text-xs opacity-75">
                  {stats.total > 0 ? Math.round((stats.byLevel['-1'] / stats.total) * 100) : 0}%
                </p>
              </div>
            )}
            {scoreScale.map((score) => (
              <div key={score.value} className={`${score.color} px-4 py-3 rounded-lg text-center`}>
                <p className="text-xs font-medium mb-1">{score.label}</p>
                <p className="text-2xl font-bold">{stats.byLevel[score.value] || 0}</p>
                <p className="text-xs opacity-75">
                  {stats.total > 0 ? Math.round((stats.byLevel[score.value] / stats.total) * 100) : 0}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Échelle de notation (référence) */}
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Échelle d'évaluation
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {scoreScale.map((score) => (
              <div key={score.value} className={`${score.color} px-3 py-2 rounded-lg text-xs font-medium text-center`}>
                {score.label}
              </div>
            ))}
          </div>
        </div>

        {/* Badge Mode Lecture Seule */}
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="font-semibold text-yellow-800">Mode Lecture Seule</p>
              <p className="text-sm text-yellow-700">
                Ce questionnaire a déjà été complété. Les réponses ne peuvent plus être modifiées.
              </p>
            </div>
          </div>
        </div>

        {/* Liste détaillée de toutes les compétences */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 text-yazaki-red mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Vos Compétences Évaluées
          </h3>
          <div className="space-y-6">
            {Object.entries(skillsData).map(([categoryName, categoryData]) => {
              if (Array.isArray(categoryData)) {
                return renderSkills(categoryName, categoryData, results[categoryName] || {});
              } else {
                return renderCategory(categoryName, categoryData, results[categoryName] || {});
              }
            })}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="pt-6 border-t border-gray-200">
          {!isComplete && onEdit ? (
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
                onClick={onEdit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier et Compléter le Questionnaire
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
