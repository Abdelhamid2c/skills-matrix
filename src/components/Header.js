/**
 * Header - En-tête de l'application avec logo Yazaki et boutons d'authentification
 */

import React from 'react';

const Header = ({ onLoginClick, onSignInClick, showAuthButtons = true, onBackClick, showBackButton = false }) => {

  const handleLoginClick = (e) => {
    e.preventDefault();
    console.log('Login button clicked');
    if (onLoginClick) {
      onLoginClick();
    }
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    console.log('Sign Up button clicked');
    if (onSignInClick) {
      onSignInClick();
    }
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    console.log('Back button clicked');
    if (onBackClick) {
      onBackClick();
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Yazaki */}
          <div className="flex items-center space-x-4">
            <img
              src="/assets/logo_yazaki.png"
              alt="Yazaki Logo"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                console.log('Logo not found, using fallback');
                e.target.style.display = 'none';
              }}
            />
            <div className="h-8 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Skills Matrix
              </h1>
              <p className="text-sm text-gray-600">
                Yazaki Morocco Meknes
              </p>
            </div>
          </div>

          {/* Bouton Retour (visible sur les pages login et form) */}
          {showBackButton && (
            <button
              type="button"
              onClick={handleBackClick}
              className="flex items-center px-6 py-2 text-gray-700 font-semibold hover:text-yazaki-red hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l'accueil
            </button>
          )}

          {/* Boutons d'authentification (visible sur la page d'accueil) */}
          {showAuthButtons && (
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleLoginClick}
                className="px-6 py-2 text-yazaki-red font-semibold hover:text-yazaki-dark-red transition-colors duration-200 hover:bg-red-50 rounded-lg"
              >
                Login
              </button>
              <button
                type="button"
                onClick={handleSignInClick}
                className="px-6 py-2 bg-yazaki-red text-white font-semibold rounded-lg hover:bg-yazaki-dark-red transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Badge de version (visible uniquement quand ni auth ni back) */}
          {!showAuthButtons && !showBackButton && (
            <div className="hidden md:flex items-center space-x-2">
              <span className="px-3 py-1 bg-yazaki-red text-white text-sm font-semibold rounded-full">
                v1.0
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
