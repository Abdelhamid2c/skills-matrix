/**
 * CollaboratorForm - Création directe dans users
 */

import React, { useState } from 'react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import { createCollaborator } from '../api/collaboratorService';

const CollaboratorForm = ({ currentUser, onBack }) => {
  const [formData, setFormData] = useState({
    matricule: '',
    firstName: '',
    lastName: '',
    function: '',
    customFunction: '',
    projectFamily: [], // Changé en tableau pour choix multiple
    customProjectFamily: '',
    diploma: '',
    customDiploma: '',
    experience: '',
    yazakiSeniority: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const functionOptions = [
  { value: '', label: 'Sélectionner une fonction' },
  { value: 'PE Responsible', label: 'PE Responsible' },
  { value: 'PE Supervisor', label: 'PE Supervisor' },
  { value: 'IE Supervisor', label: 'IE Supervisor' },
  { value: 'PE Technician', label: 'PE Technician' },
  { value: 'IE Technician', label: 'IE Technician' },
  { value: 'PFMEA', label: 'PFMEA' },
  { value: 'SAP & Data Management', label: 'SAP & Data Management' },
  { value: 'Autocad', label: 'Autocad' },
  { value: 'Autre', label: 'Autre' },
];

  const projectFamilyOptions = [
    { value: 'XCB', label: 'XCB' },
    { value: 'XHN', label: 'XHN' },
    { value: 'DZ110', label: 'DZ110' },
    { value: 'Toyota', label: 'Toyota' },
    { value: 'Nissan', label: 'Nissan' },
    { value: 'All', label: 'All' },
    { value: 'Autre', label: 'Autre' },
  ];

  const diplomaOptions = [
    { value: '', label: 'Sélectionner un diplôme' },
    { value: 'Bac', label: 'Bac' },
    { value: 'TS (Bac+2)', label: 'TS (Bac+2)' },
    { value: 'License (Bac+3)', label: 'License (Bac+3)' },
    { value: 'Maîtrise (Bac+4)', label: 'Maîtrise (Bac+4)' },
    { value: 'Engineer (Bac+5)', label: 'Engineer (Bac+5)' },
    { value: 'Master (Bac+5)', label: 'Master (Bac+5)' },
    { value: 'Autre', label: 'Autre' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Pour les champs d'expérience, remplacer la virgule par un point
    let processedValue = value;
    if (name === 'experience' || name === 'yazakiSeniority') {
      processedValue = value.replace(',', '.');
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Nouvelle fonction pour gérer les checkboxes
  // const handleProjectChange = (projectValue) => {
  //   setFormData(prev => {
  //     let newProjects = [...prev.projectFamily];

  //     // Si "All" est sélectionné, désélectionner tout le reste
  //     if (projectValue === 'All') {
  //       newProjects = newProjects.includes('All') ? [] : ['All','xcb'];
  //     } else {
  //       // Retirer "All" si on sélectionne autre chose
  //       newProjects = newProjects.filter(p => p !== 'All');

  //       if (newProjects.includes(projectValue)) {
  //         // Désélectionner si déjà sélectionné
  //         newProjects = newProjects.filter(p => p !== projectValue);
  //       } else {
  //         // Ajouter à la sélection
  //         newProjects.push(projectValue);
  //       }
  //     }

  //     return {
  //       ...prev,
  //       projectFamily: newProjects
  //     };
  //   });

  //   // Effacer l'erreur s'il y en avait une
  //   if (errors.projectFamily) {
  //     setErrors(prev => ({
  //       ...prev,
  //       projectFamily: ''
  //     }));
  //   }
  // };

  const handleProjectChange = (projectValue) => {
  setFormData(prev => {
    let newProjects = [...prev.projectFamily];

    // Si "All" est sélectionné
    if (projectValue === 'All') {
      if (newProjects.includes('All')) {
        // Si "All" était déjà coché, tout décocher
        newProjects = [];
      } else {
        // Si on coche "All", sélectionner tous les projets (sauf "Autre")
        newProjects = projectFamilyOptions
          .filter(option => option.value !== 'Autre')
          .map(option => option.value);
      }
    } else {
      // Si on clique sur un autre projet
      if (newProjects.includes(projectValue)) {
        // Désélectionner le projet
        newProjects = newProjects.filter(p => p !== projectValue);
        // Si c'était un projet normal, retirer aussi "All"
        newProjects = newProjects.filter(p => p !== 'All');
      } else {
        // Ajouter le projet
        newProjects.push(projectValue);

        // Vérifier si tous les projets (sauf "Autre") sont maintenant sélectionnés
        const allProjectsExceptAutre = projectFamilyOptions
          .filter(option => option.value !== 'Autre')
          .map(option => option.value);

        const hasAllProjects = allProjectsExceptAutre.every(project =>
          newProjects.includes(project)
        );

        // Si tous les projets sont sélectionnés, on peut cocher "All" automatiquement
        if (hasAllProjects && !newProjects.includes('All')) {
          // Optionnel: décommenter pour auto-cocher "All"
          // newProjects.push('All');
        }
      }
    }

    return {
      ...prev,
      projectFamily: newProjects
    };
  });

  // Effacer l'erreur s'il y en avait une
  if (errors.projectFamily) {
    setErrors(prev => ({
      ...prev,
      projectFamily: ''
    }));
  }
};

  const validateForm = () => {
    const newErrors = {};

    if (!formData.matricule.trim()) {
      newErrors.matricule = 'Le matricule est requis';
    }

    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
    }

    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.function) {
      newErrors.function = 'La fonction est requise';
    } else if (formData.function === 'Autre' && !formData.customFunction.trim()) {
      newErrors.customFunction = 'Veuillez préciser la fonction';
    }

    // Validation pour choix multiple
    if (!formData.projectFamily || formData.projectFamily.length === 0) {
      newErrors.projectFamily = 'Sélectionnez au moins un projet';
    } else if (formData.projectFamily.includes('Autre') && !formData.customProjectFamily.trim()) {
      newErrors.customProjectFamily = 'Veuillez préciser le projet/famille';
    }

    if (!formData.diploma) {
      newErrors.diploma = 'Le diplôme est requis';
    } else if (formData.diploma === 'Autre' && !formData.customDiploma.trim()) {
      newErrors.customDiploma = 'Veuillez préciser le diplôme';
    }

    if (!formData.experience || parseFloat(formData.experience) < 0) {
      newErrors.experience = 'L\'expérience est requise';
    }

    if (!formData.yazakiSeniority || parseFloat(formData.yazakiSeniority) < 0) {
      newErrors.yazakiSeniority = 'L\'ancienneté Yazaki est requise';
    }

    // Validation: Expérience Totale >= Ancienneté Yazaki
    if (formData.experience && formData.yazakiSeniority) {
      const totalExp = parseFloat(formData.experience);
      const yazakiExp = parseFloat(formData.yazakiSeniority);

      if (yazakiExp > totalExp) {
        newErrors.yazakiSeniority = 'L\'ancienneté Yazaki ne peut pas dépasser l\'expérience totale';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   console.log('═══════════════════════════════════════════════════════');
  //   console.log('🎯 BOUTON "ENREGISTRER LE COLLABORATEUR" CLIQUÉ');
  //   console.log('═══════════════════════════════════════════════════════');

  //   if (!validateForm()) {
  //     console.log('❌ Validation échouée');
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     // Construire la chaîne de projets
  //     let projectFamilyValue;
  //     if (formData.projectFamily.includes('Autre')) {
  //       const otherProjects = formData.projectFamily.filter(p => p !== 'Autre');
  //       projectFamilyValue = otherProjects.length > 0
  //         ? [...otherProjects, formData.customProjectFamily].join(', ')
  //         : formData.customProjectFamily;
  //     } else {
  //       projectFamilyValue = formData.projectFamily.join(', ');
  //     }

  //     const collaboratorData = {
  //       matricule: formData.matricule.toUpperCase(),
  //       firstName: formData.firstName.trim(),
  //       lastName: formData.lastName.trim(),
  //       function: formData.function === 'Autre' ? formData.customFunction : formData.function,
  //       projectFamily: projectFamilyValue,
  //       diploma: formData.diploma === 'Autre' ? formData.customDiploma : formData.diploma,
  //       experience: parseFloat(formData.experience),
  //       yazakiSeniority: parseFloat(formData.yazakiSeniority),
  //     };

  //     console.log('📤 Création du collaborateur dans users...');
  //     console.log('📦 Données:', collaboratorData);

  //     const response = await createCollaborator(collaboratorData);

  //     console.log('✅ Collaborateur créé avec succès!');
  //     console.log('📦 Réponse:', response);

  //     if (response.success) {
  //       setSubmittedData(collaboratorData);
  //       setIsSubmitted(true);

  //       setTimeout(() => {
  //         setFormData({
  //           matricule: '',
  //           firstName: '',
  //           lastName: '',
  //           function: '',
  //           customFunction: '',
  //           projectFamily: [],
  //           customProjectFamily: '',
  //           diploma: '',
  //           customDiploma: '',
  //           experience: '',
  //           yazakiSeniority: '',
  //         });
  //         setIsSubmitted(false);
  //         setSubmittedData(null);
  //       }, 3000);
  //     }
  //   } catch (error) {
  //     console.error('❌ Erreur:', error);
  //     setErrors({
  //       submit: error.message || 'Une erreur est survenue lors de la création du collaborateur'
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //     console.log('═══════════════════════════════════════════════════════');
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log('═══════════════════════════════════════════════════════');
  console.log('🎯 BOUTON "ENREGISTRER LE COLLABORATEUR" CLIQUÉ');
  console.log('═══════════════════════════════════════════════════════');

  if (!validateForm()) {
    console.log('❌ Validation échouée');
    return;
  }

  setIsSubmitting(true);

  try {
    // Construire la chaîne de projets
    let projectFamilyValue;

    // Si "All" est sélectionné, envoyer tous les projets
    if (formData.projectFamily.includes('All')) {
      const allProjects = projectFamilyOptions
        .filter(option => option.value !== 'Autre' && option.value !== 'All')
        .map(option => option.value);

      if (formData.projectFamily.includes('Autre') && formData.customProjectFamily.trim()) {
        projectFamilyValue = [...allProjects, formData.customProjectFamily].join(', ');
      } else {
        projectFamilyValue = allProjects.join(', ');
      }
    } else if (formData.projectFamily.includes('Autre')) {
      // Si "Autre" est sélectionné (sans "All")
      const otherProjects = formData.projectFamily.filter(p => p !== 'Autre');
      projectFamilyValue = otherProjects.length > 0
        ? [...otherProjects, formData.customProjectFamily].join(', ')
        : formData.customProjectFamily;
    } else {
      // Cas normal sans "All" ni "Autre"
      projectFamilyValue = formData.projectFamily.join(', ');
    }

    const collaboratorData = {
      matricule: formData.matricule.toUpperCase(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      function: formData.function === 'Autre' ? formData.customFunction : formData.function,
      projectFamily: projectFamilyValue,
      diploma: formData.diploma === 'Autre' ? formData.customDiploma : formData.diploma,
      experience: parseFloat(formData.experience),
      yazakiSeniority: parseFloat(formData.yazakiSeniority),
    };

    console.log('📤 Création du collaborateur dans users...');
    console.log('📦 Données:', collaboratorData);

    const response = await createCollaborator(collaboratorData);

    console.log('✅ Collaborateur créé avec succès!');
    console.log('📦 Réponse:', response);

    if (response.success) {
      setSubmittedData(collaboratorData);
      setIsSubmitted(true);

      setTimeout(() => {
        setFormData({
          matricule: '',
          firstName: '',
          lastName: '',
          function: '',
          customFunction: '',
          projectFamily: [],
          customProjectFamily: '',
          diploma: '',
          customDiploma: '',
          experience: '',
          yazakiSeniority: '',
        });
        setIsSubmitted(false);
        setSubmittedData(null);
      }, 3000);
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
    setErrors({
      submit: error.message || 'Une erreur est survenue lors de la création du collaborateur'
    });
  } finally {
    setIsSubmitting(false);
    console.log('═══════════════════════════════════════════════════════');
  }
};

  if (isSubmitted && submittedData) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="card text-center">
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
            <p className="text-2xl font-bold text-yazaki-red">{submittedData.matricule}</p>
          </div>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">{submittedData.firstName} {submittedData.lastName}</span>
          </p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              🔑 Mot de passe: <strong>{submittedData.matricule}</strong>
            </p>
          </div>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mt-6 btn-secondary"
            >
              Retour à l'accueil
            </button>
          )
          }
        </div>
      </div>
    );
  }

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
            Nouveau employé
          </h2>
          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg ml-5">
            <p className="text-sm text-blue-800">
              ℹ️ Le compte sera créé avec le matricule comme mot de passe
            </p>
          </div>
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

              {/* Projet / Famille - Liste avec Checkboxes style macOS */}
              <div className={`${formData.function === 'Autre' ? '' : 'md:col-start-1'} md:col-span-2`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Projet / Famille <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                  <div className="max-h-64 overflow-y-auto">
                    {projectFamilyOptions.map((option, index) => (
                      <label
                        key={option.value}
                        className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-150 ${
                          formData.projectFamily.includes(option.value)
                            ? 'bg-blue-500 text-white'
                            : 'hover:bg-gray-50 text-gray-900'
                        } ${index !== projectFamilyOptions.length - 1 ? 'border-b border-gray-200' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.projectFamily.includes(option.value)}
                          onChange={() => handleProjectChange(option.value)}
                          className={`h-4 w-4 rounded border-2 mr-3 cursor-pointer transition-all ${
                            formData.projectFamily.includes(option.value)
                              ? 'bg-white border-white accent-blue-500'
                              : 'border-gray-400 bg-white'
                          }`}
                        />
                        <span className="flex-1 font-medium select-none">
                          {option.label}
                        </span>
                        {formData.projectFamily.includes(option.value) && (
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
                {formData.projectFamily.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <strong>{formData.projectFamily.length}</strong>&nbsp;sélectionné{formData.projectFamily.length > 1 ? 's' : ''}: {formData.projectFamily.join(', ')}
                  </p>
                )}
                {errors.projectFamily && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.projectFamily}
                  </p>
                )}
              </div>

              {formData.projectFamily.includes('Autre') && (
                <div className="md:col-span-2">
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
                </div>
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

              <div>
                <FormInput
                  label="Expérience Totale (années)"
                  name="experience"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Ex: 1.3 (1 an et 3 mois)"
                  error={errors.experience}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  💡 Ex: 2.5 = 2 ans et 5 mois
                </p>
              </div>

              <div>
                <FormInput
                  label="Ancienneté Yazaki (années)"
                  name="yazakiSeniority"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  value={formData.yazakiSeniority}
                  onChange={handleChange}
                  placeholder="Ex: 0.5 ou 0,5 (6 mois)"
                  error={errors.yazakiSeniority}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  ⚠️ Doit être ≤ à l'expérience totale
                </p>
              </div>
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
