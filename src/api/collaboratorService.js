/**
 * Service de gestion des collaborateurs
 */

import axios from './axios';

/**
 * Créer un nouveau collaborateur
 * @param {object} collaboratorData - Données du collaborateur
 */
export const createCollaborator = async (collaboratorData) => {
  try {
    const response = await axios.post('/collaborators', collaboratorData);
    console.log('"""""""""""******""""""""""')
    console.log('✅ Collaborateur créé:', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer tous les collaborateurs
 */
export const getAllCollaborators = async () => {
  try {
    const response = await axios.get('/collaborators');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer un collaborateur par matricule
 * @param {string} matricule - Matricule du collaborateur
 */
export const getCollaboratorByMatricule = async (matricule) => {
  try {
    const response = await axios.get(`/collaborators/${matricule}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mettre à jour un collaborateur
 * @param {string} id - ID du collaborateur
 * @param {object} updates - Données à mettre à jour
 */
export const updateCollaborator = async (id, updates) => {
  try {
    const response = await axios.put(`/collaborators/${id}`, updates);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Supprimer un collaborateur
 * @param {string} id - ID du collaborateur
 */
export const deleteCollaborator = async (id) => {
  try {
    const response = await axios.delete(`/collaborators/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Rechercher des collaborateurs
 * @param {object} filters - Filtres de recherche
 */
export const searchCollaborators = async (filters) => {
  try {
    const response = await axios.get('/collaborators', { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};
