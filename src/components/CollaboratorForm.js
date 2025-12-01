/**
 * Composant CollaboratorForm
 * Formulaire principal pour la saisie des informations d'un collaborateur
 * 
 * Ce composant gère :
 * - L'état du formulaire via useState
 * - La validation des champs
 * - La soumission des données
 */

import React, { useState } from 'react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

// Options prédéfinies pour les champs de sélection
const FUNCTION_OPTIONS = [
  { value: '', label: 'Sélectionnez une fonction' },
  { value: 'software_engineer', label: 'Software Engineer' },
  { value: 'tech_lead', label: 'Tech Lead' },
  { value: 'project_manager', label: 'Project Manager' },
  { value: 'qa_engineer', label: 'QA Engineer' },
  { value: 'devops_engineer', label: 'DevOps Engineer' },
  { value: 'data_analyst', label: 'Data Analyst' },
  { value: 'ui_ux_designer', label: 'UI/UX Designer' },
  { value: 'scrum_master', label: 'Scrum Master' },
  { value: 'other', label: 'Autre' },
];

const PROJECT_OPTIONS = [
  { value: '', label: 'Sélectionnez un projet/famille' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'harness_design', label: 'Harness Design' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'quality', label: 'Quality' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'it_services', label: 'IT Services' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'other', label: 'Autre' },
];

const DIPLOMA_OPTIONS = [
  { value: '', label: 'Sélectionnez un diplôme' },
  { value: 'bac', label: 'Baccalauréat' },
  { value: 'bac_plus_2', label: 'Bac +2 (BTS/DUT)' },
  { value: 'licence', label: 'Licence (Bac +3)' },
  { value: 'master', label: 'Master (Bac +5)' },
  { value: 'ingenieur', label: 'Diplôme d\'Ingénieur' },
  { value: 'doctorat', label: 'Doctorat' },
  { value: 'other', label: 'Autre' },
];

// État initial du formulaire
const INITIAL_FORM_STATE = {
  firstName: '',
  lastName: '',
  function: '',
  customFunction: '',
  project: '',
  customProject: '',
  diploma: '',
  customDiploma: '',
  experience: '',
  yazakiSeniority: '',
};

// État initial des erreurs
const INITIAL_ERRORS_STATE = {
  firstName: '',
  lastName: '',
  function: '',
  project: '',
  diploma: '',
  experience: '',
  yazakiSeniority: '',
};

const CollaboratorForm = () => {
  // État pour les données du formulaire
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  
  // État pour les messages d'erreur
  const [errors, setErrors] = useState(INITIAL_ERRORS_STATE);
  
  // État pour indiquer si le formulaire a été soumis
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // État pour le chargement
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Gère les changements dans les champs du formulaire
   * @param {Event} e - Événement de changement
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Mise à jour de la valeur du champ
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Effacement de l'erreur lors de la modification
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Valide tous les champs du formulaire
   * @returns {boolean} - True si le formulaire est valide
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Validation du prénom
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.firstName)) {
      newErrors.firstName = 'Le prénom ne doit contenir que des lettres';
    }
    
    // Validation du nom
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Le nom doit contenir au moins 2 caractères';
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Le nom ne doit contenir que des lettres';
    }
    
    // Validation de la fonction
    if (!formData.function) {
      newErrors.function = 'La fonction est requise';
    } else if (formData.function === 'other' && !formData.customFunction.trim()) {
      newErrors.function = 'Veuillez préciser la fonction';
    }
    
    // Validation du projet/famille
    if (!formData.project) {
      newErrors.project = 'Le projet/famille est requis';
    } else if (formData.project === 'other' && !formData.customProject.trim()) {
      newErrors.project = 'Veuillez préciser le projet/famille';
    }
    
    // Validation du diplôme
    if (!formData.diploma) {
      newErrors.diploma = 'Le diplôme est requis';
    } else if (formData.diploma === 'other' && !formData.customDiploma.trim()) {
      newErrors.diploma = 'Veuillez préciser le diplôme';
    }
    
    // Validation de l'expérience
    if (!formData.experience) {
      newErrors.experience = 'L\'expérience est requise';
    } else if (isNaN(formData.experience) || Number(formData.experience) < 0) {
      newErrors.experience = 'L\'expérience doit être un nombre positif';
    } else if (Number(formData.experience) > 50) {
      newErrors.experience = 'L\'expérience semble incorrecte (max 50 ans)';
    }
    
    // Validation de l'ancienneté Yazaki
    if (!formData.yazakiSeniority) {
      newErrors.yazakiSeniority = 'L\'ancienneté Yazaki est requise';
    } else if (isNaN(formData.yazakiSeniority) || Number(formData.yazakiSeniority) < 0) {
      newErrors.yazakiSeniority = 'L\'ancienneté doit être un nombre positif';
    } else if (Number(formData.yazakiSeniority) > Number(formData.experience)) {
      newErrors.yazakiSeniority = 'L\'ancienneté ne peut pas dépasser l\'expérience totale';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Gère la soumission du formulaire
   * @param {Event} e - Événement de soumission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation du formulaire
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulation d'une requête API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Préparation des données finales
    const finalData = {
      ...formData,
      function: formData.function === 'other' ? formData.customFunction : formData.function,
      project: formData.project === 'other' ? formData.customProject : formData.project,
      diploma: formData.diploma === 'other' ? formData.customDiploma : formData.diploma,
      experience: Number(formData.experience),
      yazakiSeniority: Number(formData.yazakiSeniority),
    };
    
    console.log('Données du collaborateur:', finalData);
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  /**
   * Réinitialise le formulaire
   */
  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors(INITIAL_ERRORS_STATE);
    setIsSubmitted(false);
  };

  // Affichage du message de succès après soumission
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="card text-center">
          {/* Icône de succès */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-10 h-10 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Collaborateur enregistré !
          </h2>
          <p className="text-gray-600 mb-6">
            Les informations de <span className="font-semibold">{formData.firstName} {formData.lastName}</span> ont été enregistrées avec succès.
          </p>
          
          {/* Résumé des informations */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-700 mb-3">Résumé :</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">Fonction :</span>
              <span className="text-gray-800">
                {formData.function === 'other' 
                  ? formData.customFunction 
                  : FUNCTION_OPTIONS.find(f => f.value === formData.function)?.label}
              </span>
              <span className="text-gray-500">Projet/Famille :</span>
              <span className="text-gray-800">
                {formData.project === 'other' 
                  ? formData.customProject 
                  : PROJECT_OPTIONS.find(p => p.value === formData.project)?.label}
              </span>
              <span className="text-gray-500">Expérience :</span>
              <span className="text-gray-800">{formData.experience} ans</span>
              <span className="text-gray-500">Ancienneté Yazaki :</span>
              <span className="text-gray-800">{formData.yazakiSeniority} ans</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleReset}
              className="btn-primary flex-1"
            >
              Ajouter un autre collaborateur
            </button>
            <button 
              onClick={() => alert('Fonctionnalité à venir : Évaluation technique')}
              className="btn-secondary flex-1"
            >
              Passer à l'évaluation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="card">
        {/* En-tête du formulaire */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Nouveau Collaborateur
          </h2>
          <p className="text-gray-500">
            Remplissez les informations ci-dessous pour créer un profil collaborateur
          </p>
        </div>
        
        {/* Formulaire */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Section Identité */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-yazaki-primary text-white rounded-lg flex items-center justify-center text-sm">1</span>
              Identité
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Prénom"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ex: Mohammed"
                error={errors.firstName}
                required
              />
              
              <FormInput
                label="Nom"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Ex: Alaoui"
                error={errors.lastName}
                required
              />
            </div>
          </div>
          
          {/* Section Poste */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-yazaki-primary text-white rounded-lg flex items-center justify-center text-sm">2</span>
              Poste
            </h3>
            
            <div className="space-y-4">
              <FormSelect
                label="Fonction"
                name="function"
                value={formData.function}
                onChange={handleChange}
                options={FUNCTION_OPTIONS}
                error={errors.function}
                required
              />
              
              {/* Champ personnalisé si "Autre" est sélectionné */}
              {formData.function === 'other' && (
                <FormInput
                  label="Précisez la fonction"
                  name="customFunction"
                  value={formData.customFunction}
                  onChange={handleChange}
                  placeholder="Entrez la fonction"
                  error={errors.function && formData.function === 'other' ? errors.function : ''}
                  required
                />
              )}
              
              <FormSelect
                label="Projet / Famille"
                name="project"
                value={formData.project}
                onChange={handleChange}
                options={PROJECT_OPTIONS}
                error={errors.project}
                required
              />
              
              {formData.project === 'other' && (
                <FormInput
                  label="Précisez le projet/famille"
                  name="customProject"
                  value={formData.customProject}
                  onChange={handleChange}
                  placeholder="Entrez le projet/famille"
                  error={errors.project && formData.project === 'other' ? errors.project : ''}
                  required
                />
              )}
            </div>
          </div>
          
          {/* Section Formation & Expérience */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-yazaki-primary text-white rounded-lg flex items-center justify-center text-sm">3</span>
              Formation & Expérience
            </h3>
            
            <div className="space-y-4">
              <FormSelect
                label="Diplôme"
                name="diploma"
                value={formData.diploma}
                onChange={handleChange}
                options={DIPLOMA_OPTIONS}
                error={errors.diploma}
                required
              />
              
              {formData.diploma === 'other' && (
                <FormInput
                  label="Précisez le diplôme"
                  name="customDiploma"
                  value={formData.customDiploma}
                  onChange={handleChange}
                  placeholder="Entrez le diplôme"
                  error={errors.diploma && formData.diploma === 'other' ? errors.diploma : ''}
                  required
                />
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Expérience (années)"
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Ex: 5"
                  min="0"
                  max="50"
                  error={errors.experience}
                  required
                />
                
                <FormInput
                  label="Ancienneté Yazaki (années)"
                  name="yazakiSeniority"
                  type="number"
                  value={formData.yazakiSeniority}
                  onChange={handleChange}
                  placeholder="Ex: 3"
                  min="0"
                  max="50"
                  error={errors.yazakiSeniority}
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary flex-1"
            >
              Réinitialiser
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Enregistrer le collaborateur
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollaboratorForm;
