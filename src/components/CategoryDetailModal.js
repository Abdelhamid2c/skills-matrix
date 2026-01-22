import React, { useState } from 'react';
import { decodeFirebaseKey } from '../utils/firebaseKeyEncoder';

const CategoryDetailModal = ({ isOpen, categoryName, categoryData, onClose }) => {
  const [expandedNodes, setExpandedNodes] = useState({});

  if (!isOpen) return null;

  // Fonction pour obtenir la couleur du badge selon le score
  const getScoreBadgeColor = (score) => {
    if (score === -1 || score === null || score === undefined) {
      return 'bg-red-100 text-red-800';
    }
    if (score >= 3) return 'bg-green-100 text-green-800';
    if (score >= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  const getScoreBadgeText = (score) => {
    if (score === -1 || score === null || score === undefined) {
      return '❌ Non rempli';
    }
    return score;
  };

  // Toggle expansion
  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Vérifier si les données contiennent des enfants (objets imbriqués)
  const hasNestedData = (data) => {
    return Object.values(data).some(val => typeof val === 'object' && val !== null);
  };

  // Affichage HORIZONTAL pour catégories simples (sans enfants)
  const renderSimpleHorizontal = (data) => {
    const items = Object.entries(data).filter(([_, score]) => typeof score === 'number');

    return (
      <div className="flex flex-wrap gap-4 justify-center">
        {items.map(([name, score]) => {
          const decodedName = decodeFirebaseKey(name);
          return (
            <div
              key={name}
              className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-300 hover:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md min-w-fit"
            >
              <span className="text-gray-800 font-medium text-base mr-4">{decodedName}</span>
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${getScoreBadgeColor(score)}`}>
                {getScoreBadgeText(score)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Affichage ARBORESCENCE pour catégories avec enfants
  const renderTreeStructure = (data, level = 0, parentName = '') => {
    const entries = Object.entries(data);

    return (
      <div className="space-y-2">
        {entries.map(([name, childData], index) => {
          const decodedName = decodeFirebaseKey(name);
          const isLeaf = typeof childData === 'number';
          const currentNodeId = `${parentName}-${name}`;
          const isExpanded = expandedNodes[currentNodeId] !== false;
          const hasChildren = !isLeaf && Object.keys(childData).length > 0;
          const isLastChild = index === entries.length - 1;

          if (isLeaf) {
            // Feuille - compétence avec score
            return (
              <div key={name} className="flex items-center gap-2 ml-4 py-2">
                {/* Ligne d'arborescence */}
                <div className="flex items-center min-w-fit">
                  <span className="text-gray-400 text-lg">├─ </span>
                  <span className="text-gray-600 font-medium">{decodedName}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ml-auto ${getScoreBadgeColor(childData)}`}>
                  {getScoreBadgeText(childData)}
                </span>
              </div>
            );
          }

          // Branche - catégorie avec enfants
          return (
            <div key={name}>
              {/* Bouton parent avec collapse/expand */}
              <button
                onClick={() => toggleNode(currentNodeId)}
                className="w-full flex items-center gap-2 py-3 px-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg font-semibold border-2 border-gray-900 hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md ml-4 mb-2"
              >
                {/* Icône de chevron */}
                <svg
                  className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>

                {/* Nom de la catégorie */}
                <span>{decodedName}</span>

                {/* Nombre d'éléments */}
                <span className="text-sm font-normal ml-auto bg-white bg-opacity-20 px-3 py-1 rounded">
                  ({Object.keys(childData).length} éléments)
                </span>
              </button>

              {/* Enfants - Afficher seulement si expanded */}
              {isExpanded && hasChildren && (
                <div className="ml-2">
                  {renderTreeStructure(childData, level + 1, currentNodeId)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Affichage HORIZONTAL pour niveau supérieur (Technical Skills avec ses catégories)
  const renderHorizontalLevel = (data) => {
    const entries = Object.entries(data);

    return (
      <div className="space-y-8">
        {/* Catégories principales en horizontal */}
        <div className="flex flex-wrap gap-4 justify-center">
          {entries.map(([name, childData]) => {
            const decodedName = decodeFirebaseKey(name);
            const isLeaf = typeof childData === 'number';
            const currentNodeId = name;
            const isExpanded = expandedNodes[currentNodeId] !== false;
            const itemCount = isLeaf ? 1 : Object.keys(childData).length;

            return (
              <button
                key={name}
                onClick={() => toggleNode(currentNodeId)}
                className="flex flex-col items-center px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg font-semibold border-2 border-gray-900 hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md min-w-fit hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <span>{decodedName}</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
                <span className="text-xs font-normal mt-2 text-gray-300">
                  ({itemCount} {itemCount === 1 ? 'élément' : 'éléments'})
                </span>
              </button>
            );
          })}
        </div>

        {/* Détails des catégories expandées */}
        <div className="space-y-6">
          {entries.map(([name, childData]) => {
            const decodedName = decodeFirebaseKey(name);
            const currentNodeId = name;
            const isExpanded = expandedNodes[currentNodeId] !== false;
            const isLeaf = typeof childData === 'number';

            if (!isExpanded) return null;

            return (
              <div key={`expanded-${name}`} className="border-t-2 border-gray-300 pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{decodedName}</h3>

                {isLeaf ? (
                  // Afficher le score si c'est une feuille
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-gray-700 font-medium">{decodedName}</span>
                    <span className={`px-4 py-2 rounded-full font-bold ${getScoreBadgeColor(childData)}`}>
                      {getScoreBadgeText(childData)}
                    </span>
                  </div>
                ) : (
                  // Afficher l'arborescence si c'est une branche
                  renderTreeStructure(childData, 0, name)
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Fonction pour obtenir l'icône selon la catégorie
  const getCategoryIcon = () => {
    switch (categoryName) {
      case 'Communication Skills':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'Behavioral Traits':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Management Skills':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'Soft Skills':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'Technical Skills':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V6.5m-11-5h8m-8 3h8m-8 3h5" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      {/* CONTENEUR PRINCIPAL */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-h-[95vh] overflow-hidden flex flex-col max-w-7xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white p-4 flex items-center justify-between border-b-4 border-red-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              {getCategoryIcon()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{categoryName}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-red-500 p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-12 bg-gradient-to-br from-gray-50 to-gray-100">
          {categoryData && Object.keys(categoryData).length > 0 ? (
            hasNestedData(categoryData) ? (
              // Affichage HORIZONTAL avec détails en arborescence
              renderHorizontalLevel(categoryData)
            ) : (
              // Affichage SIMPLE HORIZONTAL pour données simples
              renderSimpleHorizontal(categoryData)
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-center font-medium text-lg">Aucune donnée disponible</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-100 p-3 border-t-2 border-gray-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 hover:scale-105 text-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailModal;
