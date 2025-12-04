/**
 * QuestionnaireReadOnly - Affichage du questionnaire en mode lecture seule
 */

import React, { useState } from 'react';
import {
  getScaleForCategory,
  getScoreLabel as getScoreLabelFromScale,
  getScoreColor as getScoreColorFromScale
} from '../assets/questions';
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

  // Obtenir le label du score selon la catégorie
  const getScoreLabel = (score, categoryPath) => {
    const scale = getScaleForCategory(categoryPath);
    return getScoreLabelFromScale(score, scale);
  };

  // Obtenir la couleur du score selon la catégorie
  const getScoreColor = (score, categoryPath) => {
    const scale = getScaleForCategory(categoryPath);
    return getScoreColorFromScale(score, scale);
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
    const categoryPathArray = [...parentPath, categoryName];
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
                            : getScoreColor(score, categoryPathArray) + ' border-transparent'
                        }`}
                      >
                        {isUnanswered ? '❌ Non rempli' : `${score} - ${getScoreLabel(score, categoryPathArray)}`}
                      </span>

                      {/* Bouton Modifier pour cette compétence */}
                      <button
                        onClick={() => handleEditSkill(categoryPathArray, skillName)}
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

  /**
   * Calculer les indicateurs de performance
   */
  const calculateKPIs = () => {
    // Valeurs fixes temporaires - à calculer dynamiquement plus tard
    return {
      capabilityRatioOverallPP: 75,
      capabilityRatioAccountableTasks: 82,
      technicalCapabilityRatioOverallPP: 68,
      softSkillsRatio: 85,
      managementSkillsRatio: 70,
      behavioralTraitsRatio: 90,
      communicationSkillsRatio: 88
    };
  };

  const kpis = calculateKPIs();

  /**
   * Obtenir la couleur selon le pourcentage
   */
  const getKPIColor = (percentage) => {
    if (percentage >= 80) return 'from-green-500 to-green-600';
    if (percentage >= 60) return 'from-yellow-500 to-yellow-600';
    if (percentage >= 40) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  /**
   * Obtenir la couleur du texte selon le pourcentage
   */
  const getKPITextColor = (percentage) => {
    if (percentage >= 80) return 'text-green-700';
    if (percentage >= 60) return 'text-yellow-700';
    if (percentage >= 40) return 'text-orange-700';
    return 'text-red-700';
  };

  /**
   * Obtenir la couleur de fond selon le pourcentage
   */
  const getKPIBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-50';
    if (percentage >= 60) return 'bg-yellow-50';
    if (percentage >= 40) return 'bg-orange-50';
    return 'bg-red-50';
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

        {/* Titre "Vos Compétences" */}
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Skills</h3>

        {/* 7 Cartes KPIs */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Capability Ratio Overall PP */}
          <div className={`${getKPIBgColor(kpis.capabilityRatioOverallPP)} rounded-xl p-5 border-2 border-gray-200 hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Capability Ratio Overall PP
                </p>
                <div className="flex items-baseline">
                  <span className={`text-3xl font-bold ${getKPITextColor(kpis.capabilityRatioOverallPP)}`}>
                    {kpis.capabilityRatioOverallPP}%
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${getKPIColor(kpis.capabilityRatioOverallPP)} rounded-lg flex items-center justify-center shadow-md`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${getKPIColor(kpis.capabilityRatioOverallPP)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${kpis.capabilityRatioOverallPP}%` }}
              ></div>
            </div>
          </div>

          {/* 2. Capability Ratio Accountable Tasks */}
          <div className={`${getKPIBgColor(kpis.capabilityRatioAccountableTasks)} rounded-xl p-5 border-2 border-gray-200 hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Accountable Tasks
                </p>
                <div className="flex items-baseline">
                  <span className={`text-3xl font-bold ${getKPITextColor(kpis.capabilityRatioAccountableTasks)}`}>
                    {kpis.capabilityRatioAccountableTasks}%
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${getKPIColor(kpis.capabilityRatioAccountableTasks)} rounded-lg flex items-center justify-center shadow-md`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${getKPIColor(kpis.capabilityRatioAccountableTasks)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${kpis.capabilityRatioAccountableTasks}%` }}
              ></div>
            </div>
          </div>

          {/* 3. Technical Capability Ratio Overall PP */}
          <div className={`${getKPIBgColor(kpis.technicalCapabilityRatioOverallPP)} rounded-xl p-5 border-2 border-gray-200 hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Technical Capability
                </p>
                <div className="flex items-baseline">
                  <span className={`text-3xl font-bold ${getKPITextColor(kpis.technicalCapabilityRatioOverallPP)}`}>
                    {kpis.technicalCapabilityRatioOverallPP}%
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${getKPIColor(kpis.technicalCapabilityRatioOverallPP)} rounded-lg flex items-center justify-center shadow-md`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${getKPIColor(kpis.technicalCapabilityRatioOverallPP)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${kpis.technicalCapabilityRatioOverallPP}%` }}
              ></div>
            </div>
          </div>

          {/* 4. Soft Skills Ratio */}
          <div className={`${getKPIBgColor(kpis.softSkillsRatio)} rounded-xl p-5 border-2 border-gray-200 hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Soft Skills
                </p>
                <div className="flex items-baseline">
                  <span className={`text-3xl font-bold ${getKPITextColor(kpis.softSkillsRatio)}`}>
                    {kpis.softSkillsRatio}%
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${getKPIColor(kpis.softSkillsRatio)} rounded-lg flex items-center justify-center shadow-md`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${getKPIColor(kpis.softSkillsRatio)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${kpis.softSkillsRatio}%` }}
              ></div>
            </div>
          </div>

          {/* 5. Management Skills Ratio */}
          <div className={`${getKPIBgColor(kpis.managementSkillsRatio)} rounded-xl p-5 border-2 border-gray-200 hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Management Skills
                </p>
                <div className="flex items-baseline">
                  <span className={`text-3xl font-bold ${getKPITextColor(kpis.managementSkillsRatio)}`}>
                    {kpis.managementSkillsRatio}%
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${getKPIColor(kpis.managementSkillsRatio)} rounded-lg flex items-center justify-center shadow-md`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${getKPIColor(kpis.managementSkillsRatio)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${kpis.managementSkillsRatio}%` }}
              ></div>
            </div>
          </div>

          {/* 6. Behavioral Traits Ratio */}
          <div className={`${getKPIBgColor(kpis.behavioralTraitsRatio)} rounded-xl p-5 border-2 border-gray-200 hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Behavioral Traits
                </p>
                <div className="flex items-baseline">
                  <span className={`text-3xl font-bold ${getKPITextColor(kpis.behavioralTraitsRatio)}`}>
                    {kpis.behavioralTraitsRatio}%
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${getKPIColor(kpis.behavioralTraitsRatio)} rounded-lg flex items-center justify-center shadow-md`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${getKPIColor(kpis.behavioralTraitsRatio)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${kpis.behavioralTraitsRatio}%` }}
              ></div>
            </div>
          </div>

          {/* 7. Communication Skills Ratio */}
          <div className={`${getKPIBgColor(kpis.communicationSkillsRatio)} rounded-xl p-5 border-2 border-gray-200 hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Communication Skills
                </p>
                <div className="flex items-baseline">
                  <span className={`text-3xl font-bold ${getKPITextColor(kpis.communicationSkillsRatio)}`}>
                    {kpis.communicationSkillsRatio}%
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${getKPIColor(kpis.communicationSkillsRatio)} rounded-lg flex items-center justify-center shadow-md`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${getKPIColor(kpis.communicationSkillsRatio)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${kpis.communicationSkillsRatio}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Statistiques de progression */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-bold text-gray-900">Progression</h4>
            <span className="text-3xl font-bold text-yazaki-red">{completionPercentage}%</span>
          </div>

          <p className="text-sm text-blue-700 mb-3">
            {stats.answeredSkills} / {stats.totalSkills} compétences évaluées
            {stats.unansweredSkills > 0 && (
              <span className="ml-2 text-red-600 font-bold">
                ({stats.unansweredSkills} non remplies)
              </span>
            )}
          </p>

          <div className={`w-full rounded-full h-3 ${
            actuallyComplete ? 'bg-green-200' : 'bg-orange-200'
          }`}>
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                actuallyComplete ? 'bg-green-600' : 'bg-orange-600'
              }`}
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Résultats */}
        <div className="space-y-4">
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
