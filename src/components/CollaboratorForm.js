/**
 * CollaboratorForm - Formulaire de saisie des informations collaborateur
 * Gère la saisie, la validation et la soumission des données
 */

import React, { useState } from 'react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

const CollaboratorForm = () => {
  // État initial du formulaire
  const [formData, setFormData] = useState({
    matricule: '',
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

  // État des erreurs de validation
  const [errors, setErrors] = useState({});

  // État de soumission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Options pour les listes déroulantes
  const functionOptions = [
    { value: '', label: 'Sélectionner une fonction' },
    { value: 'IE Supervisor', label: 'IE Supervisor' },
    { value: 'IE Responsible', label: 'IE Responsible' },
    { value: 'PE Responsible', label: 'PE Responsible' },
    { value: 'PE Supervisor', label: 'PE Supervisor' },
    { value: 'PE Technician', label: 'PE Technician' },
    { value: 'PFMEA', label: 'PFMEA' },
    { value: 'SAP & Data management', label: 'SAP & Data management' },
    { value: 'Autocad', label: 'Autocad' },
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
    { value: 'Bac+2 (TS)', label: 'Bac+2 (TS)' },
    { value: 'Bac+3 (Bachelor)', label: 'Bac+3 (Bachelor)' },
    { value: 'Bac+4 (Maîtrise)', label: 'Bac+4 (Maîtrise)' },
    { value: 'Bac+5 (Master/Ingénieur)', label: 'Bac+5 (Master/Ingénieur)' },
    { value: 'Bac+8 (Doctorat)', label: 'Bac+8 (Doctorat)' },
    { value: 'Formation Professionnelle', label: 'Formation Professionnelle' },
    { value: 'Autre', label: 'Autre' },
  ];

  /**
   * Gestion des changements dans les champs du formulaire
   */
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
  };

  /**
   * Validation du formulaire
   * @returns {boolean} - true si le formulaire est valide
   */
  const validateForm = () => {
    const newErrors = {};

    // Validation du matricule (unique, requis, format)
    if (!formData.matricule.trim()) {
      newErrors.matricule = 'Le matricule est requis';
    } else if (!/^[A-Z0-9]{4,10}$/.test(formData.matricule)) {
      newErrors.matricule = 'Le matricule doit contenir 4 à 10 caractères alphanumériques majuscules (ex: YMM12345)';
    }

    // Validation du prénom
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
    } else if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(formData.firstName)) {
      newErrors.firstName = 'Le prénom ne doit contenir que des lettres';
    }

    // Validation du nom
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Le nom doit contenir au moins 2 caractères';
    } else if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Le nom ne doit contenir que des lettres';
    }

    // Validation de la fonction
    if (!formData.function) {
      newErrors.function = 'La fonction est requise';
    } else if (formData.function === 'Autre' && !formData.customFunction.trim()) {
      newErrors.customFunction = 'Veuillez préciser la fonction';
    }

    // Validation du projet/famille
    if (!formData.projectFamily) {
      newErrors.projectFamily = 'Le projet/famille est requis';
    } else if (formData.projectFamily === 'Autre' && !formData.customProjectFamily.trim()) {
      newErrors.customProjectFamily = 'Veuillez préciser le projet/famille';
    }

    // Validation du diplôme
    if (!formData.diploma) {
      newErrors.diploma = 'Le diplôme est requis';
    } else if (formData.diploma === 'Autre' && !formData.customDiploma.trim()) {
      newErrors.customDiploma = 'Veuillez préciser le diplôme';
    }

    // Validation de l'expérience
    if (!formData.experience) {
      newErrors.experience = 'L\'expérience est requise';
    } else if (parseFloat(formData.experience) < 0) {
      newErrors.experience = 'L\'expérience ne peut pas être négative';
    } else if (parseFloat(formData.experience) > 50) {
      newErrors.experience = 'L\'expérience ne peut pas dépasser 50 ans';
    }

    // Validation de l'ancienneté Yazaki
    if (!formData.yazakiSeniority) {
      newErrors.yazakiSeniority = 'L\'ancienneté Yazaki est requise';
    } else if (parseFloat(formData.yazakiSeniority) < 0) {
      newErrors.yazakiSeniority = 'L\'ancienneté ne peut pas être négative';
    } else if (parseFloat(formData.yazakiSeniority) > parseFloat(formData.experience)) {
      newErrors.yazakiSeniority = 'L\'ancienneté Yazaki ne peut pas dépasser l\'expérience totale';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation avant soumission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulation d'un appel API (à remplacer par votre vraie API)
    try {
      // Préparer les données finales
      const finalData = {
        matricule: formData.matricule.toUpperCase(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        function: formData.function === 'Autre' ? formData.customFunction : formData.function,
        projectFamily: formData.projectFamily === 'Autre' ? formData.customProjectFamily : formData.projectFamily,
        diploma: formData.diploma === 'Autre' ? formData.customDiploma : formData.diploma,
        experience: parseFloat(formData.experience),
        yazakiSeniority: parseFloat(formData.yazakiSeniority),
      };

      console.log('Données du collaborateur:', finalData);

      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSubmitted(true);

      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        setFormData({
          matricule: '',
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
        setIsSubmitted(false);
      }, 3000);

    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setErrors({ submit: 'Une erreur est survenue lors de la soumission' });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Écran de succès après soumission
   */
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="card text-center">
          {/* Icône de succès */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Collaborateur enregistré !
          </h2>
          <div className="mb-4 p-4 bg-yazaki-light-gray rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Matricule</p>
            <p className="text-2xl font-bold text-yazaki-red">{formData.matricule}</p>
          </div>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">{formData.firstName} {formData.lastName}</span>
          </p>
          <p className="text-gray-600 mt-2">
            Les informations ont été enregistrées avec succès dans la Skills Matrix
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-slide-in">
      <div className="card">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <span className="w-2 h-8 bg-yazaki-red rounded-full mr-3"></span>
            Nouveau Collaborateur
          </h2>
          <p className="text-gray-600 ml-5">
            Remplissez les informations du collaborateur pour créer son profil dans la Skills Matrix
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Identification */}
          <div className="section-container">
            <h3 className="section-header">
              <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              Identification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
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
                <p className="mt-1 text-xs text-gray-500">
                  📌 Format: 4 à 10 caractères alphanumériques majuscules (identifiant unique)
                </p>
              </div>

              <FormInput
                label="Prénom"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Entrez le prénom"
                error={errors.firstName}
                required
              />

              <FormInput
                label="Nom"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Entrez le nom"
                error={errors.lastName}
                required
              />
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

          {/* Erreur de soumission */}
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

          {/* Bouton de soumission */}
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
                Enregistrement en cours...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Enregistrer le Collaborateur
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CollaboratorForm;
