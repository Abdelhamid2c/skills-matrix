/**
 * CollaboratorForm - Direct creation in users
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
    plant: '',
    function: '',
    customFunction: '',
    projectFamily: '',
    diploma: '',
    customDiploma: '',
    experience: '',
    yazakiSeniority: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.matricule.trim()) {
      newErrors.matricule = 'Matricule is required';
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const collaboratorData = {
        matricule: formData.matricule.toUpperCase(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        plant: formData.plant,
        function: formData.function === 'Other' ? formData.customFunction : formData.function,
        projectFamily: formData.projectFamily.trim(),
        diploma: formData.diploma === 'Other' ? formData.customDiploma : formData.diploma,
        experience: parseFloat(formData.experience),
        yazakiSeniority: parseFloat(formData.yazakiSeniority),
      };

      const response = await createCollaborator(collaboratorData);

      if (response.success) {
        setSubmittedData(collaboratorData);
        setIsSubmitted(true);

        setTimeout(() => {
          setFormData({
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
          });
          setIsSubmitted(false);
          setSubmittedData(null);
        }, 3000);
      }
    } catch (error) {
      setErrors({
        submit: error.message || 'An error occurred while creating the collaborator'
      });
    } finally {
      setIsSubmitting(false);
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
            Collaborator registered!
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
              🔑 Password: <strong>{submittedData.matricule}</strong>
            </p>
          </div>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mt-6 btn-secondary"
            >
              Back to home
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
            Back to home
          </button>
        )}

        <div className="mb-8 border-b border-gray-200 pb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <span className="w-2 h-8 bg-yazaki-red rounded-full mr-3"></span>
            New Employee
          </h2>
          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg ml-5">
            <p className="text-sm text-blue-800">
              ℹ️ The account will be created with the matricule as password
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
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Save Collaborator
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CollaboratorForm;
