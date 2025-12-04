/**
 * Service API pour le questionnaire de compétences
 */

import axios from 'axios';
import { encodeObjectForFirebase, decodeObjectFromFirebase } from '../utils/firebaseKeyEncoder';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Soumettre les résultats du questionnaire
 */
export const submitQuestionnaireResults = async (matricule, results) => {
  try {
    console.log('📤 Envoi des résultats du questionnaire...');
    console.log('Matricule:', matricule);
    console.log('Résultats (avant encodage):', results);

    // Encoder les clés pour Firebase
    const encodedResults = encodeObjectForFirebase(results);
    console.log('Résultats (après encodage):', encodedResults);

    const response = await axios.post(
      `${API_URL}/questionnaire/submit`,
      {
        matricule,
        results: encodedResults
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    console.log('✅ Résultats envoyés avec succès:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi des résultats:', error);

    if (error.response) {
      throw new Error(error.response.data.message || 'Erreur lors de la soumission du questionnaire');
    } else if (error.request) {
      throw new Error('Impossible de contacter le serveur');
    } else {
      throw new Error('Erreur lors de la préparation de la requête');
    }
  }
};

/**
 * Récupérer les résultats d'un utilisateur
 */
export const getUserQuestionnaireResults = async (matricule) => {
  try {
    console.log('🔍 Vérification de l\'existence d\'un questionnaire pour:', matricule);

    const response = await axios.get(
      `${API_URL}/questionnaire/results/${matricule}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    // Décoder les résultats reçus de Firebase
    if (response.data && response.data.data && response.data.data.results) {
      response.data.data.results = decodeObjectFromFirebase(response.data.data.results);
      console.log('✅ Questionnaire trouvé et décodé:', response.data.data);
    }

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('ℹ️ Aucun questionnaire existant pour cet utilisateur');
      return null;
    }
    console.error('❌ Erreur lors de la récupération des résultats:', error);
    throw error;
  }
};

/**
 * Vérifier si un utilisateur a déjà rempli le questionnaire
 */
export const checkQuestionnaireExists = async (matricule) => {
  try {
    const result = await getUserQuestionnaireResults(matricule);
    return result !== null;
  } catch (error) {
    return false;
  }
};

/**
 * Sauvegarder la progression du questionnaire (sauvegarde partielle)
 */
export const saveQuestionnaireProgress = async (matricule, partialResults) => {
  try {
    console.log('💾 Sauvegarde de la progression pour:', matricule);

    const response = await axios.post(
      `${API_URL}/questionnaire/save-progress`,
      {
        matricule,
        results: partialResults
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    console.log('✅ Progression sauvegardée');
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde de la progression:', error);
    throw error;
  }
};

export default {
  submitQuestionnaireResults,
  getUserQuestionnaireResults,
  checkQuestionnaireExists,
  saveQuestionnaireProgress
};
