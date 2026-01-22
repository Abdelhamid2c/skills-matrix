/**
 * Questionnaire - Multi-step Skills Questionnaire
 */

import React, { useState, useEffect } from 'react';
import {
  skillsData,
  scoreScale,
  behavioralScoreScale,
  getScaleForCategory,
  getScoreLabel,
  getScoreColor,
  generateQuestionnaireSteps
} from '../assets/questions';
import QuestionnaireSummary from './QuestionnaireSummary';
import QuestionnaireReadOnly from './QuestionnaireReadOnly';
import { getUserQuestionnaireResults, saveQuestionnaireProgress } from '../api/questionnaireService';
import { encodeObjectForFirebase, decodeObjectFromFirebase, decodeFirebaseKey } from '../utils/firebaseKeyEncoder';
import { calculateKPIs } from '../utils/kpiCalculator';
import { saveKPIs } from '../api/questionnaireService';
import UpdateCollaboratorForm from './UpdateCollaboratorForm';

const Questionnaire = ({ currentUser, onBack }) => {
  // États
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [steps, setSteps] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingQuestionnaire, setExistingQuestionnaire] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [originalAnswers, setOriginalAnswers] = useState({}); // Nouveau: sauvegarder les réponses originales
  const [editingSkill, setEditingSkill] = useState(null); // Nouvelle: compétence en cours de modification
  const [showSkillModal, setShowSkillModal] = useState(false); // Nouvelle: modal de modification
  const [imageUrl, setImageUrl] = useState(null);
  // Ajouter un état pour le mode édition du collaborateur
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [displayUser, setDisplayUser] = useState(currentUser);
  const[editModeUser, setEditModeUser] = useState(null);
  // Vérifier si l'utilisateur a déjà rempli le questionnaire
  useEffect(() => {
    const checkExistingQuestionnaire = async () => {
      if (!displayUser || !displayUser.matricule) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 Vérification du questionnaire existant pour:', displayUser.matricule);

        const result = await getUserQuestionnaireResults(displayUser.matricule);

        if (result && result.data) {
          console.log('✅ Questionnaire existant trouvé:', result.data);

          // Décoder les résultats si nécessaire
          const decodedData = {
            ...result.data,
            results: result.data.results ? decodeObjectFromFirebase(result.data.results) : {}
          };

          setExistingQuestionnaire(decodedData);

          // Si mode édition, charger les réponses existantes
          if (isEditMode && decodedData.results) {
            setAnswers(decodedData.results);
            setOriginalAnswers(JSON.parse(JSON.stringify(decodedData.results))); // Copie profonde
            console.log('📝 Mode édition activé - Réponses chargées');
            console.log(editModeUser);

            setDisplayUser(editModeUser);
          }
        } else {
          console.log('ℹ️ Aucun questionnaire existant');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingQuestionnaire();
  }, [displayUser, isEditMode]);


  // Générer les étapes à partir du JSON
  useEffect(() => {
    const generatedSteps = generateQuestionnaireSteps(skillsData);
    setSteps(generatedSteps);
    console.log('📊 Questionnaire initialisé:', {
      totalSteps: generatedSteps.length,
      categories: Object.keys(skillsData).length
    });
  }, []);

  useEffect(() => {
    if (displayUser?.image) {
      // console.log('🖼️ URL de l\'image sauvegardée:', currentUser.image);
      // console.log('🌐 URL complète construite:', `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${currentUser.image}`);
      setImageUrl(`${process.env.REACT_APP_API_URL.replace('/api', '') || 'http://localhost:5000'}/${displayUser.image}`);
    }
    else {
      setImageUrl(null);
    }
  }, [displayUser]);

// const baseUrl = "http://localhost:5000/assets/";
// const filename = imageUrl.substring(imageUrl.lastIndexOf("\\") + 1);
// const fullUrl = baseUrl + filename;
// console.log("Constructed URL:", fullUrl);
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

  /**
   * Annuler le mode modification et restaurer les réponses originales
   */
  const handleCancelEdit = () => {
    console.log('❌ Annulation du mode modification');

    // Restaurer les réponses originales
    setAnswers(JSON.parse(JSON.stringify(originalAnswers)));


    if (editModeUser) {
    setDisplayUser(editModeUser);
    console.log('🔄 Utilisateur restauré:', displayUser);
  }
    // Quitter le mode édition
    setIsEditMode(false);

    // Retourner à l'étape 0
    setCurrentStep(0);

    // Cacher le résumé si affiché
    setShowSummary(false);

    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.log('✅ Mode modification annulé - Réponses restaurées');
  };

  /**
   * Activer le mode modification depuis QuestionnaireReadOnly
   */
  // const handleEdit = () => {
  //   console.log('✏️ Activation du mode modification');

  //   // Sauvegarder les réponses actuelles comme backup
  //   if (existingQuestionnaire && existingQuestionnaire.results) {
  //     setOriginalAnswers(JSON.parse(JSON.stringify(existingQuestionnaire.results)));
  //     setAnswers(JSON.parse(JSON.stringify(existingQuestionnaire.results)));
  //   }

  //   setIsEditMode(true);
  //   setCurrentStep(0);
  //   setShowSummary(false);

  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // };
  const handleEdit = (editInfo) => {
    console.log('✏️ Activation du mode modification:', editInfo);
    setEditModeUser(editInfo.currentUser || null);
    // Utiliser displayUser si fourni, sinon currentUser
    const userToUse = editInfo?.displayUser || displayUser;

    // Mettre à jour displayUser seulement si editMode est 'all'
    if (editInfo.editMode === 'all') {
      setDisplayUser(userToUse);
    }
    // Sauvegarder les réponses actuelles comme backup
    if (existingQuestionnaire && existingQuestionnaire.results) {
      setOriginalAnswers(JSON.parse(JSON.stringify(existingQuestionnaire.results)));
      setAnswers(JSON.parse(JSON.stringify(existingQuestionnaire.results)));
    }

    if (editInfo.editMode === 'single') {
      // Mode modification d'une seule compétence
      setEditingSkill(editInfo);
      setShowSkillModal(true);
    } else {
      // Mode modification complète
      setIsEditMode(true);
      setCurrentStep(0);
      setShowSummary(false);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Fermer le modal de modification de compétence
   */
  const handleCloseSkillModal = () => {
    setShowSkillModal(false);
    setEditingSkill(null);
  };

  /**
   * Sauvegarder la modification d'une seule compétence
   */
  const handleSaveSkill = async (newScore) => {
    if (!editingSkill) return;

    try {
      setIsSaving(true);

      // Mettre à jour les réponses
      const updatedAnswers = JSON.parse(JSON.stringify(answers));
      let current = updatedAnswers;

      // Naviguer jusqu'à la compétence
      for (let i = 0; i < editingSkill.categoryPath.length; i++) {
        const key = editingSkill.categoryPath[i];
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }

      // Mettre à jour le score
      current[editingSkill.skillName] = newScore;

      setAnswers(updatedAnswers);

      // Sauvegarder dans Firebase
      await saveProgress(updatedAnswers);

      console.log('✅ Compétence mise à jour avec succès');

      // Fermer le modal
      handleCloseSkillModal();

      // Recharger le questionnaire
      const result = await getUserQuestionnaireResults(displayUser.matricule);
      if (result && result.data) {
        const decodedData = {
          ...result.data,
          results: result.data.results ? decodeObjectFromFirebase(result.data.results) : {}
        };
        setExistingQuestionnaire(decodedData);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la compétence');
    } finally {
      setIsSaving(false);
    }
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

  /**
   * Sauvegarder automatiquement la progression avec KPIs
   */
  const saveProgress = async (updatedAnswers) => {
    if (!displayUser || !displayUser.matricule) {
      console.log('⚠️ Impossible de sauvegarder - utilisateur non connecté');
      return;
    }

    try {
      setIsSaving(true);
      console.log('💾 Sauvegarde automatique de la progression...');

      // Normaliser les réponses pour la sauvegarde
      const normalized = normalizeAnswers(skillsData, updatedAnswers);

      // Encoder les clés pour Firebase
      const encoded = encodeObjectForFirebase(normalized);

      await saveQuestionnaireProgress(displayUser.matricule, encoded);

      // Calculer et sauvegarder les KPIs
      const kpis = calculateKPIs(displayUser, normalized);
      await saveKPIs(displayUser.matricule, kpis);
      console.log('✅ Progression et KPIs sauvegardés automatiquement');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde automatique:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSuccess = (updatedUserData) => {
  console.log('***************** Données utilisateur mises à jour:', updatedUserData);

  // Mettre à jour le currentUser avec les nouvelles données
  const newCurrentUser = {
    ...displayUser,
    ...updatedUserData,
    image: updatedUserData.image || displayUser.image,
  };

  // Mettre à jour l'image URL
  if (updatedUserData.image) {
    const baseUrl = process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL.replace('/api', '')
      : 'http://localhost:5000';
    const newImageUrl = `${baseUrl}/${updatedUserData.image}`;
    setImageUrl(newImageUrl);
  }

  // Fermer le formulaire de mise à jour
  setShowUpdateForm(false);

  // Optionnel: Afficher un message de succès
  console.log('✨ Profil mis à jour avec succès!');

  // Forcer le re-render avec les nouvelles données
  window.location.reload(); // Alternative plus simple si le parent ne peut pas être modifié
};


  /**
   * Fonction pour normaliser les réponses (même logique que QuestionnaireSummary)
   */
  const normalizeAnswers = (structure, userAnswers) => {
    const normalized = {};

    const processCategory = (categoryName, categoryData, answerPath = []) => {
      if (Array.isArray(categoryData)) {
        const categoryAnswers = {};
        categoryData.forEach(skillName => {
          let currentAnswer = userAnswers;
          for (const key of [...answerPath, categoryName]) {
            currentAnswer = currentAnswer?.[key];
          }

          const userValue = currentAnswer?.[skillName];
          categoryAnswers[skillName] = userValue !== undefined && userValue !== null ? userValue : -1;
        });

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
   * Gérer le passage à l'étape suivante avec sauvegarde
   */
  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      console.log(`➡️ Passage à l'étape ${currentStep + 2}/${steps.length}`);

      // Sauvegarder la progression avant de passer à l'étape suivante
      await saveProgress(answers);

      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Gérer le retour à l'étape précédente
   */
  const handlePrevious = () => {
    if (currentStep > 0) {
      console.log(`⬅️ Retour à l'étape ${currentStep}/${steps.length}`);
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Gérer les changements de réponses
   */
  const handleAnswerChange = (categoryPath, skillName, value) => {
    console.log(`📝 Réponse modifiée: ${categoryPath.join(' > ')} > ${skillName} = ${value}`);

    setAnswers(prevAnswers => {
      const newAnswers = { ...prevAnswers };
      let current = newAnswers;

      // Créer la structure imbriquée si nécessaire
      for (let i = 0; i < categoryPath.length; i++) {
        const key = categoryPath[i];
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }

      // Définir la valeur
      current[skillName] = value;

      return newAnswers;
    });
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

  const handleSuccess = async (response) => {
    console.log('✅ Questionnaire sauvegardé avec succès!', response);

    // Recharger les données depuis Firebase
    try {
      console.log('🔄 Rechargement du questionnaire...');

      const result = await getUserQuestionnaireResults(displayUser.matricule);

      if (result && result.data) {
        console.log('✅ Questionnaire rechargé:', result.data);

        // Réinitialiser tous les états
        setExistingQuestionnaire(result.data);
        setIsEditMode(false);
        setShowSummary(false);
        setAnswers({});

        // Scroll vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('❌ Erreur lors du rechargement:', error);

      // En cas d'erreur, utiliser les données locales
      setExistingQuestionnaire({
        results: answers,
        submittedAt: new Date().toISOString()
      });
      setIsEditMode(false);
      setShowSummary(false);
    }
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

  // Loader while checking
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="card text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yazaki-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  // If questionnaire already exists AND not in edit mode
  if (existingQuestionnaire && !isEditMode && !showSummary && !showSkillModal) {
    return (
      <QuestionnaireReadOnly
        currentUser={displayUser}
        questionnaireData={existingQuestionnaire}
        onBack={onBack}
        onEdit={handleEdit}
      />
    );
  }

  // If showing summary
  if (showSummary) {
    return (
      <QuestionnaireSummary
        currentUser={displayUser}
        answers={answers}
        onBack={handleBackFromSummary}
        onSuccess={handleSuccess}
      />
    );
  }

  const currentStepData = steps[currentStep];
  const progress = calculateProgress();
  const answeredCount = countAnsweredSkills(currentStepData);
  const totalSkills = currentStepData?.skills?.length || 0;
  const completedSteps = countCompletedSteps();


  // Get the appropriate scale for the current step
  const currentScale = currentStepData ? getScaleForCategory(currentStepData.path) : scoreScale;


  // Si on affiche le formulaire de mise à jour
  if (showUpdateForm) {
    return (
      <UpdateCollaboratorForm
        currentUser={displayUser}
        onBack={() => setShowUpdateForm(false)}
        onSuccess={handleUpdateSuccess}
      />
    );
  }

  return (
    <>
      {/* Skill edit modal */}
      {showSkillModal && editingSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Edit Skill
                </h3>
                <button
                  onClick={handleCloseSkillModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                {decodeFirebaseKey(editingSkill.skillName)}
              </p>
            </div>

            <div className="p-6">
              {/* Get scale for this skill */}
              {(() => {
                const skillScale = getScaleForCategory(editingSkill.categoryPath);
                const isBehavioral = skillScale.length > 5;

                return (
                  <>
                    {/* Evaluation scale */}
                    <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-3">
                        {isBehavioral ? 'Evaluation scale (0-10)' : 'Evaluation scale (0-4)'}
                      </h4>
                      <div className={`grid grid-cols-1 ${isBehavioral ? 'sm:grid-cols-6' : 'sm:grid-cols-5'} gap-2`}>
                        {skillScale.map((score) => (
                          <div key={score.value} className={`${score.color} px-3 py-2 rounded-lg text-xs font-medium text-center`}>
                            {score.value}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Score selection */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Select your level:
                      </label>
                      {skillScale.map((scoreOption) => {
                        // Get current score
                        let currentScore = -1;
                        let current = answers;
                        for (const key of editingSkill.categoryPath) {
                          current = current?.[key];
                        }
                        currentScore = current?.[editingSkill.skillName] ?? -1;

                        return (
                          <button
                            key={scoreOption.value}
                            onClick={() => handleSaveSkill(scoreOption.value)}
                            disabled={isSaving}
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                              currentScore === scoreOption.value
                                ? 'border-yazaki-red bg-red-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow'
                            } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mr-3  ${scoreOption.color}`}>
                                {/* ${
                                  scoreOption.value <= 2 ? 'bg-red-500' :
                                  scoreOption.value <= 4 ? 'bg-orange-500' :
                                  scoreOption.value <= 6 ? 'bg-yellow-500' :
                                  scoreOption.value <= 8 ? 'bg-green-500' :
                                  scoreOption.value === 9 ? 'bg-blue-500' : 'bg-purple-500'
                                }`}> */}
                                  {scoreOption.value}
                                </span>
                                <div>
                                  <p className="font-semibold text-gray-900">{scoreOption.label}</p>
                                  {scoreOption.description && (
                                    <p className="text-xs text-gray-600 mt-1">{scoreOption.description}</p>
                                  )}
                                </div>
                              </div>
                              {currentScore === scoreOption.value && (
                                <svg className="w-6 h-6 text-yazaki-red" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseSkillModal}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main questionnaire */}
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="card">
          {/* Edit mode badge */}
          {isEditMode && (
            <div className="mb-6 bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-orange-800">Edit Mode</p>
                    <p className="text-sm text-orange-700">
                      You can modify your previous answers
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
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Autosave indicator */}
          {isSaving && (
            <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3 flex items-center">
              <svg className="animate-spin h-5 w-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium text-blue-800">💾 Saving...</span>
            </div>
          )}

          {/* Header */}
          <div className="mb-8 border-b border-gray-200 pb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="w-2 h-8 bg-yazaki-red rounded-full mr-3"></span>
                Skills Assessment Questionnaire
              </h2>
              {displayUser && (
                <div className="flex items-center gap-4">
                  {/* Bouton de modification */}
                  {/* <button
                    type="button"
                    onClick={() => setShowUpdateForm(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                    title="Update employee information"
                  >
                    <svg className="w-6 h-6 text-gray-600 group-hover:text-yazaki-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button> */}

                  <div className="flex items-center gap-6">
                    {/* Informations textuelles */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-yazaki-red">{displayUser.matricule}</p>
                      <p className="text-sm text-gray-600">{displayUser.firstName} {displayUser.lastName}</p>
                    </div>

                    {/* Photo de profil */
                    console.log(".......... ", editModeUser)
                    }
                    <div className="flex-shrink-0">
                      {displayUser.image ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL.replace('/api', '') || 'http://localhost:5000'}/${displayUser.image}`}
                          // src ={displayUser.image}
                          alt={`${displayUser.firstName} ${displayUser.lastName}`}
                          className="w-16 h-16 rounded-lg object-cover border-2 border-yazaki-red shadow-md hover:shadow-lg transition-shadow duration-200"
                          style={{
                            objectFit: 'cover',
                            objectPosition: '50% 30%',
                          }}
                          title={`${displayUser.firstName} ${displayUser.lastName}`}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-yazaki-red to-red-600 flex items-center justify-center shadow-md">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-sm font-semibold text-yazaki-red">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-yazaki-red to-red-600 h-3 rounded-full transition-all duration-500 ease-out shadow-md"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Autosave info */}
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-3 mt-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-800">
                  <strong>Autosave enabled</strong> - Your answers are saved at each step
                </p>
              </div>
            </div>

            {/* Current step display */}
            {currentStepData && (
              <>
                {/* Step title with main category */}
                <div className="mt-8 mb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yazaki-red to-red-600 rounded-lg flex items-center justify-center mr-4 shadow-md">
                      <span className="text-white font-bold text-xl">{currentStep + 1}</span>
                    </div>
                    <div className="flex-1">
                      {/* Show main category if different from title */}
                      {currentStepData.path.length > 1 && currentStepData.path[0] !== currentStepData.title && (
                        <p className="text-sm font-semibold text-yazaki-red uppercase tracking-wide mb-1">
                          {currentStepData.path[0]}
                        </p>
                      )}
                      <h3 className="text-2xl font-bold text-gray-900">
                        {currentStepData.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Step {currentStep + 1} of {steps.length} • {answeredCount} / {totalSkills} skills assessed
                      </p>
                    </div>
                  </div>

                  {/* Breadcrumb */}
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2 mb-3">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <div className="flex items-center flex-wrap gap-2">
                      {currentStepData.path.map((pathSegment, index) => (
                        <React.Fragment key={index}>
                          {index > 0 && (
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                          <span className={index === currentStepData.path.length - 1 ? 'font-semibold text-gray-900' : ''}>
                            {pathSegment}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Scale indicator */}
                  <div className={`p-3 rounded-lg border-2 ${
                    currentScale.length > 5
                      ? 'bg-purple-50 border-purple-300'
                      : 'bg-blue-50 border-blue-300'
                  }`}>
                    <p className={`text-sm font-semibold ${
                      currentScale.length > 5 ? 'text-purple-900' : 'text-blue-900'
                    }`}>
                      {currentScale.length > 5
                        ? '📊 Behavioral/Communication Scale: 0 to 10'
                        : '🔧 Technical Skills Scale: 0 to 4'}
                    </p>
                  </div>
                </div>

                {/* Evaluation scale */}
                <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {currentScale.length > 5 ? 'Evaluation scale' : 'Evaluation scale'}
                  </h4>
                  <div className={`grid ${
                    currentScale.length > 5 ? 'grid-cols-2 sm:grid-cols-5 lg:grid-cols-11' : 'grid-cols-1 sm:grid-cols-5'
                  } gap-2`}>
                    {currentScale.map((score) => (
                      <div
                        key={score.value}
                        className={`${score.color} px-3 py-2 rounded-lg font-semibold text-center transition-all hover:shadow-md border-2 border-transparent hover:border-blue-400`}
                        title={score.description}
                      >
                        <div className="text-sm">{score.value}</div>
                        {currentScale.length <= 5 && (
                          <div className="text-xs mt-1 font-normal">{score.label.split(' - ')[1]}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills list */}
                <div className="space-y-4">
                  {currentStepData.skills.map((skillName, index) => (
                    <div
                      key={`${currentStepData.path.join('-')}-${skillName}`}
                      className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-yazaki-red hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center flex-1">
                          <span className="w-10 h-10 bg-gradient-to-br from-yazaki-red to-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4 shadow-md">
                            {index + 1}
                          </span>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {skillName}
                          </h4>
                        </div>
                      </div>

                      {/* Selection buttons */}
                      <div className={`grid ${
                        currentScale.length > 5 ? 'grid-cols-2 sm:grid-cols-5 lg:grid-cols-11' : 'grid-cols-2 sm:grid-cols-5'
                      } gap-2`}>
                        {currentScale.map((scoreOption) => {
                          const currentValue = getSkillValue(currentStepData, skillName);
                          const isSelected = currentValue === scoreOption.value;

                          return (
                            <button
                              key={scoreOption.value}
                              type="button"
                              onClick={() => {
                                updateSkillValue(currentStepData, skillName, scoreOption.value);
                                saveProgress({
                                  ...answers,
                                  [currentStepData.path[0]]: {
                                    ...answers[currentStepData.path[0]],
                                    [skillName]: scoreOption.value
                                  }
                                });
                              }}
                              className={`p-3 rounded-lg font-bold text-lg transition-all duration-200 border-2 ${
                                isSelected
                                  ? `${scoreOption.color.replace('bg-', 'bg-opacity-100 bg-')} border-yazaki-red shadow-lg scale-105`
                                  : `${scoreOption.color} border-gray-300 hover:border-yazaki-red hover:scale-105`
                              }`}
                              title={`${scoreOption.label}${scoreOption.description ? ` - ${scoreOption.description}` : ''}`}
                            >
                              {scoreOption.value}
                              {isSelected && (
                                <svg className="w-4 h-4 inline-block ml-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center ${
                      currentStep === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  {currentStep === steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleGoToSummary}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                    >
                      View Summary
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isSaving}
                      className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center ${
                        isSaving
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-yazaki-red to-red-600 text-white hover:from-red-600 hover:to-red-700'
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          Next
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Questionnaire;
