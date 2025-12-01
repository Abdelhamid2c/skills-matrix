/**
 * Login - Page de connexion
 * Le mot de passe doit être le matricule
 */

import React, { useState } from 'react';
import FormInput from './FormInput';
import { login } from '../api/authService';

const Login = ({ onBack, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    matricule: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'matricule' ? value.toUpperCase() : value;

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.matricule.trim()) {
      newErrors.matricule = 'Le matricule est requis';
    } else if (!/^[A-Z0-9]{4,10}$/.test(formData.matricule)) {
      newErrors.matricule = 'Format de matricule invalide (4 à 10 caractères alphanumériques)';
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

    try {
      console.log('📤 Appel API login avec:', {
        matricule: formData.matricule,
        password: formData.password,
        passwordMatchesMatricule: formData.password.toUpperCase() === formData.matricule.toUpperCase()
      });

      const response = await login(formData.matricule, formData.password);

      console.log('✅ Connexion réussie!');
      console.log('📦 Données utilisateur:', response.data);

      if (response.success) {
        onLoginSuccess && onLoginSuccess({
          ...response.data,
          authenticated: true
        });
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);

      setErrors({
        submit: error.message || 'Matricule ou mot de passe incorrect'
      });
    } finally {
      setIsSubmitting(false);
      console.log('═══════════════════════════════════════════════════════');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full animate-fade-in">
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-yazaki-red to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h2>
            <p className="text-gray-600">Accédez à votre espace Skills Matrix</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <FormInput
                label="Matricule"
                name="matricule"
                type="text"
                value={formData.matricule}
                onChange={handleChange}
                placeholder="Ex: YMM12345"
                error={errors.matricule}
                required
              />
              <p className="mt-1 text-xs text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Votre identifiant unique (4 à 10 caractères)
              </p>
            </div>

            <div>
              <FormInput
                label="Mot de passe"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Votre matricule"
                error={errors.password}
                required
              />
              <p className="mt-1 text-xs text-yazaki-red flex items-center font-medium">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Le mot de passe est votre matricule
              </p>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 animate-shake">
                <p className="text-red-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors.submit}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                Pas encore de compte ? Utilisez le bouton "Créer un Compte" sur la page d'accueil
              </p>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Connexion simplifiée
            </p>
            <p className="text-xs text-blue-700">
              Votre mot de passe est identique à votre matricule
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
