/**
 * Questionnaire - Questionnaire de compétences multi-étapes
 */

import React, { useState, useEffect } from 'react';
import { skillsData, scoreScale, generateQuestionnaireSteps } from '../assets/questions';
import QuestionnaireSummary from './QuestionnaireSummary';
import QuestionnaireReadOnly from './QuestionnaireReadOnly';
import { getUserQuestionnaireResults } from '../api/questionnaireService';
import { decodeObjectFromFirebase } from '../utils/firebaseKeyEncoder';

const Questionnaire = ({ currentUser, onBack }) => {
  // États
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [steps, setSteps] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingQuestionnaire, setExistingQuestionnaire] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Vérifier si l'utilisateur a déjà rempli le questionnaire
  useEffect(() => {
    const checkExistingQuestionnaire = async () => {
      if (!currentUser || !currentUser.matricule) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 Vérification du questionnaire existant pour:', currentUser.matricule);

        const result = await getUserQuestionnaireResults(currentUser.matricule);

        if (result && result.data) {
          console.log('✅ Questionnaire existant trouvé:', result.data);
          setExistingQuestionnaire(result.data);

          // Si mode édition, charger les réponses existantes
          if (isEditMode && result.data.results) {
            setAnswers(result.data.results);
            console.log('📝 Mode édition activé - Réponses chargées');
          }
        } else {
          console.log('ℹ️ Aucun questionnaire existant - mode édition');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingQuestionnaire();
  }, [currentUser, isEditMode]);

  // Générer les étapes à partir du JSON
  useEffect(() => {
    const generatedSteps = generateQuestionnaireSteps(skillsData);
    setSteps(generatedSteps);
    console.log('📊 Questionnaire initialisé:', {
      totalSteps: generatedSteps.length,
      categories: Object.keys(skillsData).length
    });
  }, []);

  // Gérer l'activation du mode édition
  const handleEnterEditMode = () => {
    console.log('✏️ Activation du mode édition');
    setIsEditMode(true);
    setExistingQuestionnaire(null);

    // Charger les réponses existantes dans le state
    if (existingQuestionnaire && existingQuestionnaire.results) {
      setAnswers(existingQuestionnaire.results);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Annuler le mode édition
  const handleCancelEdit = () => {
    console.log('❌ Annulation du mode édition');
    setIsEditMode(false);
    setAnswers({});
    window.location.reload(); // Recharger pour afficher le mode lecture seule
  };

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

  // Modifier handleSubmit pour afficher le résumé
  const handleGoToSummary = () => {
    console.log('📊 Navigation vers le résumé du questionnaire');
    setShowSummary(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromSummary = () => {
    console.log('← Retour au questionnaire');
    setShowSummary(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccess = (response) => {
    console.log('✅ Questionnaire sauvegardé avec succès!', response);
    setIsCompleted(true);
    setIsEditMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Afficher le loader pendant la vérification
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="card text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yazaki-red mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du questionnaire...</p>
        </div>
      </div>
    );
  }

  // Si le questionnaire est complété (après sauvegarde en mode édition)
  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="card text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {isEditMode ? 'Questionnaire Mis à Jour !' : 'Questionnaire Complété !'}
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Vos compétences ont été {isEditMode ? 'mises à jour' : 'enregistrées'} avec succès.
          </p>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="btn-primary"
            >
              Retour à l'accueil
            </button>
          )}
        </div>
      </div>
    );
  }

  // Si le questionnaire existe déjà ET qu'on n'est pas en mode édition
  if (existingQuestionnaire && !isEditMode) {
    return (
      <QuestionnaireReadOnly
        currentUser={currentUser}
        questionnaireData={existingQuestionnaire}
        onBack={onBack}
        onEdit={handleEnterEditMode}
      />
    );
  }

  // Si on affiche le résumé
  if (showSummary) {
    return (
      <QuestionnaireSummary
        currentUser={currentUser}
        answers={answers}
        onBack={handleBackFromSummary}
        onSuccess={handleSuccess}
      />
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
        {/* Badge Mode Édition si modification */}
        {isEditMode && (
          <div className="mb-6 bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <div>
                  <p className="font-semibold text-orange-800">Mode Modification</p>
                  <p className="text-sm text-orange-700">
                    Vous pouvez modifier vos réponses précédentes
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-white border-2 border-orange-300 text-orange-700 rounded-lg font-semibold hover:bg-orange-50 transition-all duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Annuler
              </button>
            </div>
          </div>
        )}

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
              onClick={handleGoToSummary}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Voir le Résumé
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

      {/* Si le questionnaire est complété, afficher le message de succès */}
      {isCompleted && (
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="card text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Questionnaire Complété !
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Vos compétences ont été enregistrées avec succès.
            </p>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="btn-primary"
              >
                Retour à l'accueil
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
