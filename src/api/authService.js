/**
 * Service d'authentification
 */

import axios from './axios';

/**
 * Inscription d'un nouvel utilisateur avec ses informations complètes
 * Le mot de passe sera automatiquement le matricule
 * @param {object} userData - Toutes les données de l'utilisateur
 */
export const register = async (userData) => {
  try {
    console.log('🔐 Service Auth - Register appelé avec:', userData);

    // Le mot de passe n'est pas envoyé, il sera le matricule côté backend
    const response = await axios.post('/auth/register', {
      matricule: userData.matricule,
      firstName: userData.firstName,
      lastName: userData.lastName,
      plant: userData.plant,
      function: userData.function,
      projectFamily: userData.projectFamily,
      diploma: userData.diploma,
      experience: userData.experience,
      yazakiSeniority: userData.yazakiSeniority
    });

    console.log('✅ Service Auth - Réponse register:', response.data);

    // Sauvegarder le token et les infos utilisateur complètes
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify({
        matricule: response.data.data.matricule,
        firstName: response.data.data.firstName,
        lastName: response.data.data.lastName,
        plant: response.data.data.plant,
        function: response.data.data.function,
        projectFamily: response.data.data.projectFamily,
        diploma: response.data.data.diploma,
        experience: response.data.data.experience,
        yazakiSeniority: response.data.data.yazakiSeniority
      }));

      console.log('💾 Utilisateur sauvegardé dans localStorage');
      console.log('🔑 Mot de passe automatique = Matricule');
    }

    return response.data;
  } catch (error) {
    console.error('❌ Service Auth - Erreur register:', error);
    throw error;
  }
};

/**
 * Connexion utilisateur (mot de passe = matricule)
 * @param {string} matricule - Matricule de l'utilisateur
 * @param {string} password - Mot de passe (doit être le matricule)
 */
export const login = async (matricule, password) => {
  try {
    console.log('🔐 Service Auth - Login appelé pour:', matricule);
    console.log('🔑 Vérification: password === matricule ?', password.toUpperCase() === matricule.toUpperCase());

    const response = await axios.post('/auth/login', {
      matricule,
      password
    });

    console.log('✅ Service Auth - Réponse login:', response.data);

    // Sauvegarder le token et les infos utilisateur
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify({
        matricule: response.data.data.matricule,
        firstName: response.data.data.firstName || '',
        lastName: response.data.data.lastName || '',
        plant: response.data.data.plant || '',
        function: response.data.data.function || '',
        projectFamily: response.data.data.projectFamily || '',
        diploma: response.data.data.diploma || '',
        experience: response.data.data.experience || 0,
        yazakiSeniority: response.data.data.yazakiSeniority || 0
      }));

      console.log('💾 Utilisateur sauvegardé dans localStorage');
    }

    return response.data;
  } catch (error) {
    console.error('❌ Service Auth - Erreur login:', error);
    throw error;
  }
};

/**
 * Déconnexion utilisateur
 */
export const logout = () => {
  console.log('🚪 Déconnexion de l\'utilisateur');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

/**
 * Récupérer le profil utilisateur
 */
export const getProfile = async () => {
  try {
    console.log('👤 Service Auth - Récupération du profil');
    const response = await axios.get('/auth/profile');
    console.log('✅ Service Auth - Profil récupéré:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Service Auth - Erreur profil:', error);
    throw error;
  }
};

/**
 * Vérifier si l'utilisateur est connecté
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const isAuth = !!token;
  console.log('🔒 Vérification authentification:', isAuth);
  return isAuth;
};

/**
 * Récupérer l'utilisateur connecté
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    console.log('👤 Utilisateur actuel:', user);
    return user;
  }
  console.log('👤 Aucun utilisateur connecté');
  return null;
};

/**
 * Récupérer le token
 */
export const getToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    console.log('🎫 Token récupéré:', token.substring(0, 20) + '...');
  } else {
    console.log('🎫 Aucun token trouvé');
  }
  return token;
};
