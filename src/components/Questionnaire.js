/**
 * Questionnaire - Questionnaire de compétences multi-étapes
 */

import React, { useState, useEffect } from 'react';
import { skillsData, scoreScale, generateQuestionnaireSteps } from '../assets/questions';

const Questionnaire = ({ currentUser, onBack }) => {
  // États
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [steps, setSteps] = useState([]);

  // Générer les étapes à partir du JSON
  useEffect(() => {
    const generatedSteps = generateQuestionnaireSteps(skillsData);
    setSteps(generatedSteps);
    console.log('📊 Questionnaire initialisé:', {
      totalSteps: generatedSteps.length,
      categories: Object.keys(skillsData).length
    });
  }, []);

  // Obtenir la valeur actuelle d'une compétence
  const getSkillValue = (step, skillName) => {
    let current = answers;
    for (const key of step.path) {
      if (!current[key]) return null;
      current = current[key];
    }
    return current[skillName] !== undefined ? current[skillName] : null;
  };

  // Mettre à jour la valeur d'une compétence
  const updateSkillValue = (step, skillName, value) => {
    const newAnswers = { ...answers };

    // Créer la structure si elle n'existe pas
    let current = newAnswers;
    for (let i = 0; i < step.path.length; i++) {
      const key = step.path[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }

    // Définir la valeur
    current[skillName] = value;

    setAnswers(newAnswers);
  };

  // Obtenir le chemin complet pour une compétence
  const getSkillPath = (step, skillName) => {
    return [...step.path, skillName].join(' > ');
  };

  // Navigation
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 RÉSULTATS DU QUESTIONNAIRE DE COMPÉTENCES');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('👤 Utilisateur:', currentUser?.matricule || 'Anonyme');
    console.log('📅 Date:', new Date().toISOString());
    console.log('');
    console.log('📋 Réponses complètes:');
    console.log(JSON.stringify(answers, null, 2));
    console.log('');
    console.log('📈 Statistiques:');
    const stats = calculateStats();
    console.log('Total de compétences évaluées:', stats.totalAnswered);
    console.log('Moyenne générale:', stats.averageScore.toFixed(2));
    console.log('');
    console.log('═══════════════════════════════════════════════════════');

    // TODO: Envoyer les réponses au backend
    alert('Questionnaire soumis avec succès! Consultez la console pour voir les réponses.');
  };

  // Calculer le pourcentage de complétion basé sur le NOMBRE TOTAL de réponses
  const calculateProgress = () => {
    if (steps.length === 0) return 0;

    // Compter le nombre total de compétences dans tout le questionnaire
    let totalSkillsCount = 0;
    steps.forEach(step => {
      totalSkillsCount += step.skills.length;
    });

    // Compter le nombre de réponses fournies
    const stats = calculateStats();
    const answeredCount = stats.totalAnswered;

    // Calculer le pourcentage
    if (totalSkillsCount === 0) return 0;
    return Math.round((answeredCount / totalSkillsCount) * 100);
  };

  // Compter le nombre de réponses pour l'étape actuelle
  const countAnsweredSkills = (step) => {
    let count = 0;
    step.skills.forEach(skillName => {
      if (getSkillValue(step, skillName) !== null) {
        count++;
      }
    });
    return count;
  };

  // Compter le nombre total d'étapes complétées
  const countCompletedSteps = () => {
    let completedCount = 0;
    steps.forEach(step => {
      const answered = countAnsweredSkills(step);
      if (answered === step.skills.length) {
        completedCount++;
      }
    });
    return completedCount;
  };

  // Calculer les statistiques globales
  const calculateStats = () => {
    let totalAnswered = 0;
    let totalScore = 0;

    const countAnswers = (obj) => {
      Object.values(obj).forEach(value => {
        if (typeof value === 'number') {
          totalAnswered++;
          totalScore += value;
        } else if (typeof value === 'object') {
          countAnswers(value);
        }
      });
    };

    countAnswers(answers);

    return {
      totalAnswered,
      averageScore: totalAnswered > 0 ? totalScore / totalAnswered : 0
    };
  };

  if (steps.length === 0) {
    return (
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="card text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yazaki-red mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du questionnaire...</p>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const progress = calculateProgress();
  const answeredCount = countAnsweredSkills(currentStepData);
  const totalSkills = currentStepData.skills.length;
  const completedSteps = countCompletedSteps();

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
                <p className="text-sm text-gray-600">Connecté en tant que</p>
                <p className="text-lg font-bold text-yazaki-red">{currentUser.matricule}</p>
                <p className="text-sm text-gray-600">{currentUser.firstName} {currentUser.lastName}</p>
              </div>
            )}
          </div>

          {/* Barre de progression */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Étape {currentStep + 1} sur {steps.length}
                <span className="text-xs text-gray-500 ml-2">
                  ({completedSteps} section{completedSteps > 1 ? 's' : ''} complétée{completedSteps > 1 ? 's' : ''})
                </span>
              </span>
              <span className="text-sm font-semibold text-yazaki-red">
                {progress}% complété
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yazaki-red to-red-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Titre de la section actuelle */}
          <div className="bg-gradient-to-r from-yazaki-red to-red-600 text-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">{currentStepData.category}</p>
                <h3 className="text-xl font-bold">
                  {currentStepData.subCategory || currentStepData.category}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Compétences évaluées</p>
                <p className="text-2xl font-bold">
                  {answeredCount} / {totalSkills}
                </p>
              </div>
            </div>
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

        {/* Liste des compétences en colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {currentStepData.skills.map((skillName, index) => {
            const currentValue = getSkillValue(currentStepData, skillName);

            return (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-yazaki-red transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {/* En-tête de la question */}
                <div className="mb-3">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-yazaki-red text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <h5 className="font-semibold text-gray-900 text-sm leading-tight flex-1">
                      {skillName}
                    </h5>
                  </div>
                  <p className="text-xs text-gray-500 ml-8 truncate" title={getSkillPath(currentStepData, skillName)}>
                    {getSkillPath(currentStepData, skillName)}
                  </p>
                </div>

                {/* Boutons radio verticaux compacts */}
                <div className="ml-8 space-y-2">
                  {scoreScale.map((score) => (
                    <label
                      key={score.value}
                      className={`flex items-center cursor-pointer px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                        currentValue === score.value
                          ? `${score.color} border-current shadow-md`
                          : `bg-white border-gray-300 hover:border-gray-400 text-gray-700`
                      }`}
                      title={score.description}
                    >
                      <input
                        type="radio"
                        name={`skill-${currentStep}-${index}`}
                        value={score.value}
                        checked={currentValue === score.value}
                        onChange={() => updateSkillValue(currentStepData, skillName, score.value)}
                        className="sr-only"
                      />
                      <span className="flex items-center w-full">
                        <span className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 ${
                          currentValue === score.value
                            ? 'border-current'
                            : 'border-gray-400'
                        }`}>
                          {currentValue === score.value && (
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                          )}
                        </span>
                        <span className="font-semibold text-sm mr-2">{score.value}</span>
                        <span className="text-xs flex-1">{score.label.split(' - ')[1]}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Boutons de navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-yazaki-red border-2 border-yazaki-red hover:bg-yazaki-red hover:text-white shadow-md hover:shadow-lg'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Précédent
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">
              {answeredCount === totalSkills ? (
                <span className="text-green-600 font-semibold flex items-center justify-center">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Section complétée!
                </span>
              ) : (
                <span className="text-yellow-600">
                  {totalSkills - answeredCount} compétence{totalSkills - answeredCount > 1 ? 's' : ''} restante{totalSkills - answeredCount > 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-yazaki-red text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
            >
              Suivant
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Soumettre le Questionnaire
            </button>
          )}
        </div>

        {/* Bouton retour à l'accueil */}
        {onBack && (
          <div className="mt-6 pt-6 border-t border-gray-200">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
