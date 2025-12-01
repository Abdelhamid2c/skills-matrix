/**
 * Login - Page de connexion avec matricule
 */

import React, { useState } from 'react';
import FormInput from './FormInput';

const Login = ({ onBack, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    matricule: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convertir le matricule en majuscules automatiquement
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

    // Validation du matricule
    if (!formData.matricule.trim()) {
      newErrors.matricule = 'Le matricule est requis';
    } else if (!/^[A-Z0-9]{4,10}$/.test(formData.matricule)) {
      newErrors.matricule = 'Format de matricule invalide (4 à 10 caractères alphanumériques)';
    }

    // Validation du mot de passe (doit correspondre au matricule)
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Le mot de passe doit contenir au moins 4 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Vérification simple : mot de passe = matricule (pour démonstration)
      // TODO: Remplacer par votre vraie API d'authentification
      if (formData.password.toUpperCase() === formData.matricule) {
        console.log('Login réussi:', {
          matricule: formData.matricule,
          timestamp: new Date().toISOString()
        });

        onLoginSuccess && onLoginSuccess({
          matricule: formData.matricule,
          authenticated: true
        });
      } else {
        setErrors({ submit: 'Matricule ou mot de passe incorrect' });
        setIsSubmitting(false);
      }

    } catch (error) {
      setErrors({ submit: 'Une erreur est survenue lors de la connexion' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full animate-fade-in">
        <div className="card">
          {/* Titre */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-yazaki-red to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h2>
            <p className="text-gray-600">Accédez à votre espace Skills Matrix</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Matricule */}
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

            {/* Champ Mot de passe */}
            <div>
              <FormInput
                label="Mot de passe"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Votre mot de passe"
                error={errors.password}
                required
              />
              <p className="mt-1 text-xs text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Par défaut, utilisez votre matricule comme mot de passe
              </p>
            </div>

            {/* Message d'erreur */}
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

            {/* Bouton de connexion */}
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

            {/* Lien mot de passe oublié */}
            <div className="text-center pt-4 border-t border-gray-200">
              <a
                href="#"
                className="text-sm text-yazaki-red hover:text-yazaki-dark-red font-medium inline-flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Veuillez contacter votre administrateur pour réinitialiser votre mot de passe.');
                }}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mot de passe oublié ?
              </a>
            </div>
          </form>

          {/* Information de test */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-1">
              💡 Mode démonstration
            </p>
            <p className="text-xs text-blue-700">
              Pour tester : utilisez votre matricule comme mot de passe (ex: YMM12345 / YMM12345)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
