/**
 * Register - Page d'inscription avec toutes les informations
 */

import React, { useState } from 'react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import { register } from '../api/authService';

const Register = ({ onBack, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    matricule: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    function: '',
    customFunction: '',
    projectFamily: '',
    customProjectFamily: '',
    diploma: '',
    customDiploma: '',
    experience: '',
    yazakiSeniority: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const functionOptions = [
    { value: '', label: 'Sélectionner une fonction' },
    { value: 'Ingénieur Qualité', label: 'Ingénieur Qualité' },
    { value: 'Ingénieur Production', label: 'Ingénieur Production' },
    { value: 'Ingénieur Méthodes', label: 'Ingénieur Méthodes' },
    { value: 'Ingénieur Maintenance', label: 'Ingénieur Maintenance' },
    { value: 'Technicien', label: 'Technicien' },
    { value: 'Chef de Projet', label: 'Chef de Projet' },
    { value: 'Responsable d\'Équipe', label: 'Responsable d\'Équipe' },
    { value: 'Autre', label: 'Autre' },
  ];

  const projectFamilyOptions = [
    { value: '', label: 'Sélectionner un projet/famille' },
    { value: 'Wire Harness', label: 'Wire Harness' },
    { value: 'Components', label: 'Components' },
    { value: 'Electrical Distribution Systems', label: 'Electrical Distribution Systems' },
    { value: 'Quality Assurance', label: 'Quality Assurance' },
    { value: 'Production', label: 'Production' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Autre', label: 'Autre' },
  ];

  const diplomaOptions = [
    { value: '', label: 'Sélectionner un diplôme' },
    { value: 'Bac+2 (DUT/BTS)', label: 'Bac+2 (DUT/BTS)' },
    { value: 'Bac+3 (Licence)', label: 'Bac+3 (Licence)' },
    { value: 'Bac+5 (Master/Ingénieur)', label: 'Bac+5 (Master/Ingénieur)' },
    { value: 'Bac+8 (Doctorat)', label: 'Bac+8 (Doctorat)' },
    { value: 'Formation Professionnelle', label: 'Formation Professionnelle' },
    { value: 'Autre', label: 'Autre' },
  ];

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
      newErrors.matricule = 'Format invalide (4 à 10 caractères alphanumériques)';
    }

    if (!formData.password || formData.password.length < 4) {
      newErrors.password = 'Le mot de passe doit contenir au moins 4 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
    }

    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.function) {
      newErrors.function = 'La fonction est requise';
    }

    if (!formData.projectFamily) {
      newErrors.projectFamily = 'Le projet/famille est requis';
    }

    if (!formData.diploma) {
      newErrors.diploma = 'Le diplôme est requis';
    }

    if (!formData.experience || parseFloat(formData.experience) < 0) {
      newErrors.experience = 'L\'expérience est requise';
    }

    if (!formData.yazakiSeniority || parseFloat(formData.yazakiSeniority) < 0) {
      newErrors.yazakiSeniority = 'L\'ancienneté Yazaki est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('═══════════════════════════════════════════════════════');
    console.log('📝 CRÉATION DE COMPTE');
    console.log('═══════════════════════════════════════════════════════');

    if (!validateForm()) {
      console.log('❌ Validation échouée');
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        matricule: formData.matricule,
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        function: formData.function === 'Autre' ? formData.customFunction : formData.function,
        projectFamily: formData.projectFamily === 'Autre' ? formData.customProjectFamily : formData.projectFamily,
        diploma: formData.diploma === 'Autre' ? formData.customDiploma : formData.diploma,
        experience: parseFloat(formData.experience),
        yazakiSeniority: parseFloat(formData.yazakiSeniority),
      };

      console.log('📤 Données d\'inscription:', userData);

      const response = await register(userData);

      console.log('✅ Compte créé avec succès!');
      console.log('📦 Données utilisateur:', response.data);

      if (response.success) {
        onRegisterSuccess && onRegisterSuccess({
          ...response.data,
          authenticated: true
        });
      }
    } catch (error) {
      console.error('❌ Erreur de création de compte:', error);

      setErrors({
        submit: error.message || 'Une erreur est survenue lors de la création du compte'
      });
    } finally {
      setIsSubmitting(false);
      console.log('═══════════════════════════════════════════════════════');
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-slide-in">
      <div className="card">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 flex items-center text-gray-600 hover:text-yazaki-red transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </button>
        )}

        <div className="mb-8 border-b border-gray-200 pb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <span className="w-2 h-8 bg-yazaki-red rounded-full mr-3"></span>
            Créer un Compte
          </h2>
          <p className="text-gray-600 ml-5">
            Remplissez vos informations pour créer votre compte Skills Matrix
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Authentification */}
          <div className="section-container">
            <h3 className="section-header">
              <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Authentification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
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
              </div>

              <FormInput
                label="Mot de passe"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 4 caractères"
                error={errors.password}
                required
              />

              <FormInput
                label="Confirmer le mot de passe"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Retapez le mot de passe"
                error={errors.confirmPassword}
                required
              />
            </div>
          </div>

          {/* Section: Identification */}
          <div className="section-container">
            <h3 className="section-header">
              <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              Identification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Prénom"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Votre prénom"
                error={errors.firstName}
                required
              />

              <FormInput
                label="Nom"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Votre nom"
                error={errors.lastName}
                required
              />
              SALAM
            </div>
          </div>

          {/* Section: Informations Professionnelles */}
          <div className="section-container">
            <h3 className="section-header">
              <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Informations Professionnelles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormSelect
                  label="Fonction"
                  name="function"
                  value={formData.function}
                  onChange={handleChange}
                  options={functionOptions}
                  error={errors.function}
                  required
                />
              </div>


              {formData.function === 'Autre' && (
                <FormInput
                  label="Précisez la fonction"
                  name="customFunction"
                  type="text"
                  value={formData.customFunction}
                  onChange={handleChange}
                  placeholder="Entrez la fonction"
                  error={errors.customFunction}
                  required
                />
              )}

              <div className={formData.function === 'Autre' ? '' : 'md:col-start-1'}>
                <FormSelect
                  label="Projet / Famille"
                  name="projectFamily"
                  value={formData.projectFamily}
                  onChange={handleChange}
                  options={projectFamilyOptions}
                  error={errors.projectFamily}
                  required
                />
              </div>

              {formData.projectFamily === 'Autre' && (
                <FormInput
                  label="Précisez le projet/famille"
                  name="customProjectFamily"
                  type="text"
                  value={formData.customProjectFamily}
                  onChange={handleChange}
                  placeholder="Entrez le projet/famille"
                  error={errors.customProjectFamily}
                  required
                />
              )}
            </div>
          </div>

          {/* Section: Formation et Expérience */}
          <div className="section-container">
            <h3 className="section-header">
              <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              Formation et Expérience
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormSelect
                  label="Diplôme"
                  name="diploma"
                  value={formData.diploma}
                  onChange={handleChange}
                  options={diplomaOptions}
                  error={errors.diploma}
                  required
                />
              </div>

              {formData.diploma === 'Autre' && (
                <div className="md:col-span-2">
                  <FormInput
                    label="Précisez le diplôme"
                    name="customDiploma"
                    type="text"
                    value={formData.customDiploma}
                    onChange={handleChange}
                    placeholder="Entrez le diplôme"
                    error={errors.customDiploma}
                    required
                  />
                </div>
              )}

              <FormInput
                label="Expérience Totale (années)"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                placeholder="0"
                error={errors.experience}
                min="0"
                max="50"
                required
              />

              <FormInput
                label="Ancienneté Yazaki (années)"
                name="yazakiSeniority"
                type="number"
                value={formData.yazakiSeniority}
                onChange={handleChange}
                placeholder="0"
                error={errors.yazakiSeniority}
                min="0"
                max={formData.experience || "50"}
                required
              />
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <p className="text-red-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
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
                Création en cours...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Créer mon Compte
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
