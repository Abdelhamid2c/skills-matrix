/**
 * Export centralisé de tous les services API
 */

export * as authService from './authService';
export * as collaboratorService from './collaboratorService';
export * as questionnaireService from './questionnaireService';

// Export de l'instance axios pour une utilisation directe si nécessaire
export { default as axios } from './axios';
