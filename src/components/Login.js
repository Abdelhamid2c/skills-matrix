/**
 * Login - Page de connexion
 */

import React, { useState } from 'react';
import { login } from '../api/authService';

const Login = ({ onBack, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    matricule: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Effacer l'erreur générale si elle existe
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.matricule.trim()) {
      newErrors.matricule = 'Le matricule est requis';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('═══════════════════════════════════════════════════════');
    console.log('🔐 TENTATIVE DE CONNEXION');
    console.log('═══════════════════════════════════════════════════════');

    if (!validateForm()) {
      console.log('❌ Validation échouée');
      return;
    }

    setIsSubmitting(true);
    setErrors({}); // Réinitialiser toutes les erreurs

    try {
      console.log('📤 Envoi des identifiants...');
      console.log('Matricule:', formData.matricule);

      const response = await login(formData.matricule, formData.password);

      console.log('✅ Connexion réussie!');
      console.log('📦 Réponse:', response);

      if (response.success && response.data) {
        // Connexion réussie - passer à la page suivante
        if (onLoginSuccess) {
          onLoginSuccess(response.data);
        }
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);

      // Afficher le message d'erreur SANS retourner à la page d'accueil
      setErrors({
        general: error.message || 'Identifiants incorrects. Veuillez réessayer.'
      });

      // Optionnel: Effacer le mot de passe pour permettre une nouvelle saisie
      setFormData(prev => ({
        ...prev,
        password: ''
      }));

      // NE PAS appeler onBack() ici !
    } finally {
      setIsSubmitting(false);
      console.log('═══════════════════════════════════════════════════════');
    }
  };

  return (
    <div className="max-w-md mx-auto animate-slide-in">
      <div className="card">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yazaki-red to-red-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h2>
          <p className="text-gray-600">Accédez à votre espace Skills Matrix</p>
        </div>

        {/* Message d'erreur général */}
        {errors.general && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 animate-shake">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-red-800 mb-1">Erreur de connexion</p>
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Matricule */}
          <div>
            <label htmlFor="matricule" className="block text-sm font-medium text-gray-700 mb-2">
              Matricule <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="matricule"
              name="matricule"
              value={formData.matricule}
              onChange={handleChange}
              placeholder="Entrez votre matricule"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-yazaki-red focus:border-yazaki-red transition-all duration-200 ${
                errors.matricule ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.matricule && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.matricule}
              </p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Entrez votre mot de passe"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-yazaki-red focus:border-yazaki-red transition-all duration-200 ${
                errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          {/* Info mot de passe par défaut */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-800">
                <strong>Première connexion ?</strong><br />
                Le mot de passe par défaut est votre matricule.
              </p>
            </div>
          </div>

          {/* Boutons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center ${
                isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-yazaki-red to-red-600 text-white hover:from-red-600 hover:to-red-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Se connecter
                </>
              )}
            </button>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
