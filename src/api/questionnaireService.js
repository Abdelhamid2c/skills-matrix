/**
 * Service de gestion des questionnaires
 */

import axios from './axios';

/**
 * Sauvegarder les réponses d'un questionnaire
 * @param {string} matricule - Matricule de l'utilisateur
 * @param {object} responses - Réponses du questionnaire
 */
export const saveQuestionnaire = async (matricule, responses) => {
  try {
    const response = await axios.post('/questionnaires', {
      matricule,
      responses
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer les réponses d'un questionnaire
 * @param {string} matricule - Matricule de l'utilisateur
 */
export const getQuestionnaire = async (matricule) => {
  try {
    const response = await axios.get(`/questionnaires/${matricule}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer tous les questionnaires
 */
export const getAllQuestionnaires = async () => {
  try {
    const response = await axios.get('/questionnaires');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mettre à jour un questionnaire
 * @param {string} matricule - Matricule de l'utilisateur
 * @param {object} responses - Nouvelles réponses
 */
export const updateQuestionnaire = async (matricule, responses) => {
  try {
    const response = await axios.put(`/questionnaires/${matricule}`, {
      responses
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Vérifier si un questionnaire existe
 * @param {string} matricule - Matricule de l'utilisateur
 */
export const checkQuestionnaireExists = async (matricule) => {
  try {
    const response = await axios.get(`/questionnaires/${matricule}`);
    return response.data.success;
  } catch (error) {
    return false;
  }
};
