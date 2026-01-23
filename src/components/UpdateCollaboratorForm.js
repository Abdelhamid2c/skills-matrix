/**
 * UpdateCollaboratorForm - Mise à jour des informations du collaborateur
 */

import React, { useState, useEffect } from 'react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import { updateCollaborator, getCollaboratorByMatricule } from '../api/collaboratorService';

const UpdateCollaboratorForm = ({ currentUser, onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    matricule: '',
    firstName: '',
    lastName: '',
    plant: '',
    function: '',
    customFunction: '',
    projectFamily: '',
    diploma: '',
    customDiploma: '',
    experience: '',
    yazakiSeniority: '',
    profileImage: null,
    profileImagePreview: null,
    currentImageUrl: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const plantOptions = [
    { value: '', label: 'Select a plant' },
    { value: 'YMM', label: 'Yazaki Morocco Meknes S.A. (YMM)' },
    { value: 'YMOK', label: 'Yazaki Kenitra S.A. (YMOK)' },
    { value: 'YMO', label: 'Yazaki Morocco S.A. (YMO)' },
    { value: 'YTU', label: 'Yazaki Tunisia S.A.R.L (YTU)' },
    { value: 'YEE', label: 'Yazaki EDS Egypt (YEE)' },
  ];

  const functionOptions = [
    { value: '', label: 'Select a function' },
    { value: 'PE Responsible', label: 'PE Responsible' },
    { value: 'PE Supervisor', label: 'PE Supervisor' },
    { value: 'IE Supervisor', label: 'IE Supervisor' },
    { value: 'PE Technician', label: 'PE Technician' },
    { value: 'IE Technician', label: 'IE Technician' },
    { value: 'PFMEA', label: 'PFMEA' },
    { value: 'SAP & Data Management', label: 'SAP & Data Management' },
    { value: 'Autocad', label: 'Autocad' },
    { value: 'Other', label: 'Other' },
  ];

  const diplomaOptions = [
    { value: '', label: 'Select a diploma' },
    { value: 'Bac', label: 'Bac' },
    { value: 'TS (Bac+2)', label: 'TS (Bac+2)' },
    { value: 'License (Bac+3)', label: 'License (Bac+3)' },
    { value: 'Maîtrise (Bac+4)', label: 'Maîtrise (Bac+4)' },
    { value: 'Engineer (Bac+5)', label: 'Engineer (Bac+5)' },
    { value: 'Master (Bac+5)', label: 'Master (Bac+5)' },
    { value: 'Other', label: 'Other' },
  ];

  // Charger les données du collaborateur au montage
  useEffect(() => {
    const loadCollaboratorData = async () => {
      if (!currentUser || !currentUser.matricule) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 Chargement des données du collaborateur:', currentUser.matricule);

        const response = await getCollaboratorByMatricule(currentUser.matricule);

        if (response && response.data) {
          const userData = response.data;
          console.log('✅ Données chargées:', userData);

          // Construire l'URL complète de l'image si elle existe
          let imageUrl = null;
          if (userData.image) {
            const baseUrl = process.env.REACT_APP_API_URL
              ? process.env.REACT_APP_API_URL.replace('/api', '')
              : 'http://localhost:5000';
            imageUrl = `${baseUrl}/${userData.image}`;
          }

          setFormData({
            matricule: userData.matricule || '',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            plant: userData.plant || '',
            function: userData.function || '',
            customFunction: userData.function === 'Other' ? userData.function : '',
            projectFamily: userData.projectFamily || '',
            diploma: userData.diploma || '',
            customDiploma: userData.diploma === 'Other' ? userData.diploma : '',
            experience: userData.experience?.toString() || '',
            yazakiSeniority: userData.yazakiSeniority?.toString() || '',
            profileImage: null,
            profileImagePreview: null,
            currentImageUrl: imageUrl,
          });
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement:', error);
        setErrors({ submit: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    loadCollaboratorData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;
    if (name === 'experience' || name === 'yazakiSeniority') {
      processedValue = value.replace(',', '.');
      // ⬇️ conversion en float
        processedValue = processedValue === ''
        ? ''
        : parseFloat(processedValue);
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.plant) {
      newErrors.plant = 'Plant is required';
    }

    if (!formData.function) {
      newErrors.function = 'Function is required';
    } else if (formData.function === 'Other' && !formData.customFunction.trim()) {
      newErrors.customFunction = 'Please specify the function';
    }

    if (!formData.projectFamily.trim()) {
      newErrors.projectFamily = 'Project/Family is required';
    }

    if (!formData.diploma) {
      newErrors.diploma = 'Diploma is required';
    } else if (formData.diploma === 'Other' && !formData.customDiploma.trim()) {
      newErrors.customDiploma = 'Please specify the diploma';
    }

    if (!formData.experience || parseFloat(formData.experience) < 0) {
      newErrors.experience = 'Experience is required';
    }

    if (!formData.yazakiSeniority || parseFloat(formData.yazakiSeniority) < 0) {
      newErrors.yazakiSeniority = 'Yazaki seniority is required';
    }

    if (formData.experience && formData.yazakiSeniority) {
      const totalExp = parseFloat(formData.experience);
      const yazakiExp = parseFloat(formData.yazakiSeniority);

      if (yazakiExp > totalExp) {
        newErrors.yazakiSeniority = 'Yazaki seniority cannot exceed total experience';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion de l'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        profileImage: 'Only JPEG, PNG, or WebP images are allowed'
      }));
      return;
    }

    const maxSize = 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        profileImage: `Image size must be less than 1MB (Current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        profileImage: file,
        profileImagePreview: reader.result
      }));
      setErrors(prev => ({
        ...prev,
        profileImage: ''
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: null,
      profileImagePreview: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('firstName', formData.firstName.trim());
      formDataToSend.append('lastName', formData.lastName.trim());
      formDataToSend.append('plant', formData.plant);
      formDataToSend.append('function', formData.function === 'Other' ? formData.customFunction : formData.function);
      formDataToSend.append('projectFamily', formData.projectFamily.trim());
      formDataToSend.append('diploma', formData.diploma === 'Other' ? formData.customDiploma : formData.diploma);
      formDataToSend.append('experience', parseFloat(formData.experience));
      formDataToSend.append('yazakiSeniority', parseFloat(formData.yazakiSeniority));

      if (formData.profileImage) {
        formDataToSend.append('image', formData.profileImage);
        console.log('📸 Nouvelle image ajoutée:', formData.profileImage.name);
      }

      console.log('📤 Envoi de la mise à jour...');

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/collaborators/${formData.matricule}`,
        {
          method: 'PUT',
          body: formDataToSend,
        }
      );

      const data = await response.json();

      console.log('📥 Réponse du serveur:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }

      if (data.success) {
        setIsSubmitted(true);

        setTimeout(() => {
          // ✅ Appeler onSuccess sans recharger la page
          if (onSuccess) {
            onSuccess({
              ...currentUser,
              ...data.data,
              image: data.data.image,
            });
          } else if (onBack) {
            onBack();
          }
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      setErrors({
        submit: error.message || 'An error occurred while updating the collaborator'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="card text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yazaki-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading collaborator data...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
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
            Information updated!
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            <span className="font-semibold">{formData.firstName} {formData.lastName}</span>
          </p>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary"
            >
              Back to questionnaire
            </button>
          )}
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
            Back to questionnaire
          </button>
        )}

        <div className="mb-8 border-b border-gray-200 pb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <span className="w-2 h-8 bg-yazaki-red rounded-full mr-3"></span>
            Update Employee Information
          </h2>
          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg ml-5">
            <p className="text-sm text-blue-800">
              ℹ️ Update your personal and professional information
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Photo de Profil */}
          <div className="section-container">
            <h3 className="section-header">
              <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Profile Photo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Zone de chargement */}
              <div className="md:col-span-2">
                {formData.profileImagePreview ? (
                  // Image modifiée affichée
                  <div className="relative group">
                    <img
                      src={formData.profileImagePreview}
                      alt="Profile preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-yazaki-red"
                      style={{
                        objectFit: 'cover',
                        objectPosition: '50% 30%',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      title="Remove new image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <label className="absolute bottom-2 left-2 bg-white text-gray-700 px-3 py-1 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors">
                      Change
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>
                ) : formData.currentImageUrl ? (
                  // Image actuelle affichée avec possibilité de modifier
                  <div className="relative group">
                    <img
                      src={formData.currentImageUrl}
                      alt="Current profile"
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 cursor-pointer group-hover:border-yazaki-red transition-all duration-200"
                      style={{
                        objectFit: 'cover',
                        objectPosition: '50% 30%',
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <label className="bg-white text-gray-700 px-4 py-2 rounded-lg font-semibold cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100">
                        Change Photo
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageChange}
                          disabled={isSubmitting}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  // Pas d'image - Zone d'upload
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-yazaki-red hover:bg-red-50 transition-all duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 1MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                    />
                  </label>
                )}

                {errors.profileImage && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {errors.profileImage}
                  </p>
                )}
              </div>

              {/* Infos à côté */}
              <div className="flex flex-col justify-center p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 mb-3">Requirements:</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Square format (1:1)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Min 200x200px</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Max 1MB</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>JPEG, PNG, WebP</span>
                  </li>
                </ul>
              </div>
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
              <div className="md:col-span-2">
                <FormInput
                  label="Matricule"
                  name="matricule"
                  type="text"
                  value={formData.matricule}
                  disabled
                  placeholder="Matricule"
                  className="bg-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">⚠️ Matricule cannot be changed</p>
              </div>

              <FormInput
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                error={errors.firstName}
                required
              />

              <FormInput
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                error={errors.lastName}
                required
              />

              <div className="md:col-span-2">
                <FormSelect
                  label="Site / Plant"
                  name="plant"
                  value={formData.plant}
                  onChange={handleChange}
                  options={plantOptions}
                  error={errors.plant}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: Professional Information */}
          <div className="section-container">
            <h3 className="section-header">
              <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Professional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormSelect
                  label="Function"
                  name="function"
                  value={formData.function}
                  onChange={handleChange}
                  options={functionOptions}
                  error={errors.function}
                  required
                />
              </div>

              {formData.function === 'Other' && (
                <FormInput
                  label="Specify the function"
                  name="customFunction"
                  type="text"
                  value={formData.customFunction}
                  onChange={handleChange}
                  placeholder="Enter the function"
                  error={errors.customFunction}
                  required
                />
              )}

              <div className={formData.function === 'Other' ? 'md:col-span-2' : ''}>
                <FormInput
                  label="Project / Family"
                  name="projectFamily"
                  type="text"
                  value={formData.projectFamily}
                  onChange={handleChange}
                  placeholder="Ex: XCB, XHN, Toyota..."
                  error={errors.projectFamily}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  💡 Separate with commas if several projects
                </p>
              </div>
            </div>
          </div>

          {/* Section: Education and Experience */}
          <div className="section-container">
            <h3 className="section-header">
              <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              Education and Experience
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormSelect
                  label="Diploma"
                  name="diploma"
                  value={formData.diploma}
                  onChange={handleChange}
                  options={diplomaOptions}
                  error={errors.diploma}
                  required
                />
              </div>

              {formData.diploma === 'Other' && (
                <div className="md:col-span-2">
                  <FormInput
                    label="Specify the diploma"
                    name="customDiploma"
                    type="text"
                    value={formData.customDiploma}
                    onChange={handleChange}
                    placeholder="Enter the diploma"
                    error={errors.customDiploma}
                    required
                  />
                </div>
              )}

              <div>
                <FormInput
                  label="Total Experience (years)"
                  name="experience"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Ex: 1.3 (1 year and 3 months)"
                  error={errors.experience}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  💡 Ex: 2.5 = 2 years and 5 months
                </p>
              </div>

              <div>
                <FormInput
                  label="Yazaki Seniority (years)"
                  name="yazakiSeniority"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  value={formData.yazakiSeniority}
                  onChange={handleChange}
                  placeholder="Ex: 0.5 or 0,5 (6 months)"
                  error={errors.yazakiSeniority}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  ⚠️ Must be ≤ to total experience
                </p>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <p className="text-red-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-13a1 1 0 112 0v6a1 1 0 11-2 0V5z" clipRule="evenodd" />
                </svg>
                {errors.submit}
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCollaboratorForm;
