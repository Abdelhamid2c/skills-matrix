/**
 * Configuration Axios pour les appels API
 */

import axios from 'axios';

// URL de base de l'API
const BASE_URL = process.env.REACT_APP_API_URL || 'https://skills-matrix-backend.onrender.com/api';

// Créer une instance Axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes
});

// Intercepteur de requête - Ajouter le token JWT
axiosInstance.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('📤 Requête API:', {
      method: config.method.toUpperCase(),
      url: config.url,
      data: config.data
    });

    return config;
  },
  (error) => {
    console.error('❌ Erreur requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse - Gérer les erreurs
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Réponse API:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ Erreur réponse:', error);

    // Gérer les erreurs spécifiques
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Non autorisé - Token expiré ou invalide
          console.log('🔒 Session expirée');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
          break;

        case 403:
          // Interdit
          console.log('🚫 Accès interdit');
          break;

        case 404:
          // Ressource non trouvée
          console.log('🔍 Ressource non trouvée');
          break;

        case 500:
          // Erreur serveur
          console.log('🔥 Erreur serveur');
          break;

        default:
          console.log(`⚠️ Erreur ${status}`);
      }

      return Promise.reject(data);
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      console.error('📡 Pas de réponse du serveur');
      return Promise.reject({
        success: false,
        message: 'Impossible de contacter le serveur. Vérifiez votre connexion.'
      });
    } else {
      // Erreur lors de la configuration de la requête
      console.error('⚙️ Erreur configuration:', error.message);
      return Promise.reject({
        success: false,
        message: 'Erreur lors de la requête'
      });
    }
  }
);

export default axiosInstance;
