/**
 * Composant FormSelect
 * Menu déroulant réutilisable avec gestion des erreurs
 *
 * @param {string} label - Label du champ
 * @param {string} name - Nom du champ (pour le state)
 * @param {string} value - Valeur actuelle sélectionnée
 * @param {function} onChange - Fonction de callback pour les changements
 * @param {Array} options - Liste des options [{value, label}]
 * @param {string} error - Message d'erreur à afficher
 * @param {boolean} required - Si le champ est requis
 * @param {boolean} disabled - Si le champ est désactivé
 */

import React from 'react';

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error = '',
  required = false,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      {/* Label du champ */}
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Menu déroulant */}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`form-select ${error ? 'error' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Message d'erreur */}
      {error && (
        <p id={`${name}-error`} className="error-message" role="alert">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormSelect;
