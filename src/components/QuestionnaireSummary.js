/**
 * QuestionnaireSummary - Page de résumé et confirmation du questionnaire
 */

import React, { useState, useEffect } from 'react';
import { skillsData, scoreScale } from '../assets/questions';
import { submitQuestionnaireResults } from '../api/questionnaireService';
import { encodeObjectForFirebase } from '../utils/firebaseKeyEncoder';

const QuestionnaireSummary = ({ currentUser, answers, onBack, onSuccess }) => {
  const [normalizedResults, setNormalizedResults] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({
    totalSkills: 0,
    answeredSkills: 0,
    unansweredSkills: 0,
    averageScore: 0
  });

  // Normaliser les résultats (remplacer les valeurs manquantes par -1)
  useEffect(() => {
    const normalized = normalizeAnswers(skillsData, answers);
    setNormalizedResults(normalized);

    // Calculer les statistiques
    const calculatedStats = calculateStatistics(normalized);
    setStats(calculatedStats);

    console.log('📊 Résultats normalisés:', normalized);
    console.log('📈 Statistiques:', calculatedStats);
  }, [answers]);

  /**
   * Normaliser les réponses - remplacer les valeurs manquantes par -1
   */
  const normalizeAnswers = (structure, userAnswers) => {
    const normalized = {};

    const processCategory = (categoryName, categoryData, answerPath = []) => {
      if (Array.isArray(categoryData)) {
        // C'est une liste de compétences
        const categoryAnswers = {};
        categoryData.forEach(skillName => {
          // Naviguer dans les réponses de l'utilisateur
          let currentAnswer = userAnswers;
          for (const key of [...answerPath, categoryName]) {
            currentAnswer = currentAnswer?.[key];
          }

          // Définir la valeur (-1 si non répondu, sinon la valeur fournie)
          const userValue = currentAnswer?.[skillName];
          categoryAnswers[skillName] = userValue !== undefined && userValue !== null ? userValue : -1;
        });

        // Construire le chemin dans l'objet normalisé
        let current = normalized;
        for (let i = 0; i < answerPath.length; i++) {
          const key = answerPath[i];
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        }
        current[categoryName] = categoryAnswers;

      } else if (typeof categoryData === 'object') {
        // C'est un objet avec des sous-catégories
        Object.entries(categoryData).forEach(([subCatName, subCatData]) => {
          processCategory(subCatName, subCatData, [...answerPath, categoryName]);
        });
      }
    };

    Object.entries(structure).forEach(([categoryName, categoryData]) => {
      processCategory(categoryName, categoryData);
    });

    return normalized;
  };

  /**
   * Calculer les statistiques des résultats
   */
  const calculateStatistics = (results) => {
    let total = 0;
    let answered = 0;
    let totalScore = 0;

    const countAnswers = (obj) => {
      Object.values(obj).forEach(value => {
        if (typeof value === 'number') {
          total++;
          if (value >= 0) // Compter seulement les réponses valides (>= 0)
            answered++;
          totalScore += value;
        } else if (typeof value === 'object') {
          countAnswers(value);
        }
      });
    };

    countAnswers(results);

    return {
      totalSkills: total,
      answeredSkills: answered,
      unansweredSkills: total - answered,
      averageScore: answered > 0 ? (totalScore / answered).toFixed(2) : 0
    };
  };

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
   * Soumettre les résultats au backend
   */
  const handleSubmit = async () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎯 BOUTON "CONFIRMER ET ENVOYER" CLIQUÉ');
    console.log('═══════════════════════════════════════════════════════');

    setIsSubmitting(true);

    try {
      console.log('📤 Soumission du questionnaire pour:', currentUser.matricule);

      // Encoder les résultats avant envoi
      const encodedResults = encodeObjectForFirebase(normalizedResults);

      console.log('📦 Résultats normalisés:', normalizedResults);
      console.log('🔐 Résultats encodés:', encodedResults);

      const response = await submitQuestionnaireResults(
        currentUser.matricule,
        encodedResults
      );

      console.log('✅ Questionnaire soumis avec succès!');
      console.log('📦 Réponse:', response);

      if (response.success) {
        // Appeler onSuccess pour retourner vers QuestionnaireReadOnly
        if (onSuccess) {
          onSuccess(response);
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la soumission:', error);
      alert('Erreur lors de la soumission du questionnaire. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
      console.log('═══════════════════════════════════════════════════════');
    }
  };

  /**
   * Afficher une catégorie et ses compétences
   */
  const renderCategory = (categoryName, categoryData, level = 0) => {
    if (Array.isArray(categoryData)) {
      return null; // Les tableaux sont gérés par renderSkills
    }

    return (
      <div key={categoryName} className={`${level > 0 ? 'ml-4' : ''} mb-6`}>
        <h3 className={`font-bold mb-3 ${level === 0 ? 'text-xl text-yazaki-red' : 'text-lg text-gray-800'}`}>
          {categoryName}
        </h3>
        <div className="space-y-4">
          {Object.entries(categoryData).map(([subKey, subData]) => {
            if (Array.isArray(subData)) {
              return renderSkills(subKey, subData);
            } else {
              return renderCategory(subKey, subData, level + 1);
            }
          })}
        </div>
      </div>
    );
  };

  /**
   * Afficher la liste des compétences d'une sous-catégorie
   */
  const renderSkills = (categoryName, skills) => {
    // Trouver les réponses correspondantes dans normalizedResults
    let categoryAnswers = {};
    const searchInResults = (obj, targetCategory) => {
      for (const [key, value] of Object.entries(obj)) {
        if (key === targetCategory && typeof value === 'object' && !Array.isArray(value)) {
          // Vérifier si c'est bien un objet de compétences (contient des nombres)
          const hasSkills = Object.values(value).some(v => typeof v === 'number');
          if (hasSkills) {
            categoryAnswers = value;
            return true;
          }
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
          if (searchInResults(value, targetCategory)) {
            return true;
          }
        }
      }
      return false;
    };

    searchInResults(normalizedResults, categoryName);

    return (
      <div key={categoryName} className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-2">
          {categoryName}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {skills.map((skillName, index) => {
            const score = categoryAnswers[skillName] ?? -1;
            const isAnswered = score >= 0;

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  isAnswered
                    ? 'bg-white border-green-200'
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <span className="text-sm text-gray-800 flex-1">
                  {skillName}
                </span>
                <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${getScoreBadgeColor(score)}`}>
                  {score === -1 ? '—' : score}
                </span>
              </div>
            );
          })}
        </div>
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
              <span className="w-2 h-8 bg-green-600 rounded-full mr-3"></span>
              Résumé du Questionnaire
            </h2>
            {currentUser && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Collaborateur</p>
                <p className="text-lg font-bold text-yazaki-red">{currentUser.matricule}</p>
                <p className="text-sm text-gray-600">{currentUser.firstName} {currentUser.lastName}</p>
              </div>
            )}
          </div>

          {/* Statistiques globales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
              <p className="text-sm text-blue-700 font-semibold mb-1">Total Compétences</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalSkills}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
              <p className="text-sm text-green-700 font-semibold mb-1">Évaluées</p>
              <p className="text-3xl font-bold text-green-900">{stats.answeredSkills}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border-2 border-yellow-200">
              <p className="text-sm text-yellow-700 font-semibold mb-1">Non Évaluées</p>
              <p className="text-3xl font-bold text-yellow-900">{stats.unansweredSkills}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-2 border-purple-200">
              <p className="text-sm text-purple-700 font-semibold mb-1">Moyenne</p>
              <p className="text-3xl font-bold text-purple-900">{stats.averageScore}</p>
            </div>
          </div>

          {/* Avertissement si des compétences ne sont pas évaluées */}
          {stats.unansweredSkills > 0 && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-red-800">
                    ⚠️ {stats.unansweredSkills} compétence{stats.unansweredSkills > 1 ? 's' : ''} non évaluée{stats.unansweredSkills > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-red-700">
                    Ces compétences seront marquées comme "Non répondu" (-1) dans le questionnaire
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Légende des scores */}
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

        {/* Liste détaillée de toutes les compétences */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 text-yazaki-red mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Détail des Compétences
          </h3>
          <div className="space-y-6">
            {Object.entries(skillsData).map(([categoryName, categoryData]) => {
              if (Array.isArray(categoryData)) {
                return renderSkills(categoryName, categoryData);
              } else {
                return renderCategory(categoryName, categoryData);
              }
            })}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Retour au Questionnaire
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Envoi en cours...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Confirmer et Sauvegarder
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireSummary;
