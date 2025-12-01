/**
 * App.js - Composant principal de l'application Skills Matrix
 * Gère la navigation entre les différentes pages
 */

import React, { useState } from 'react';
import Header from './Header';
import Welcome from './Welcome';
import Login from './Login';
import SignIn from './SignIn';
import CollaboratorForm from './CollaboratorForm';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome'); // welcome, login, signin, form
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const handleSignInClick = () => {
    setCurrentPage('signin');
  };

  const handleBackToWelcome = () => {
    setCurrentPage('welcome');
  };

  const handleGetStarted = () => {
    setCurrentPage('form');
  };

  const handleLoginSuccess = (userData) => {
    console.log('Login réussi:', userData);
    setIsAuthenticated(true);
    setCurrentPage('form');
  };

  const handleSignInSuccess = (userData) => {
    console.log('Inscription réussie:', userData);
    setIsAuthenticated(true);
    setCurrentPage('form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* En-tête de l'application */}
      <Header
        onLoginClick={handleLoginClick}
        onSignInClick={handleSignInClick}
        showAuthButtons={currentPage === 'welcome' && !isAuthenticated}
      />

      {/* Contenu principal - Affichage conditionnel selon la page active */}
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'welcome' && (
          <Welcome onGetStarted={handleGetStarted} />
        )}

        {currentPage === 'login' && (
          <Login
            onBack={handleBackToWelcome}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentPage === 'signin' && (
          <SignIn
            onBack={handleBackToWelcome}
            onSignInSuccess={handleSignInSuccess}
          />
        )}

        {currentPage === 'form' && (
          <CollaboratorForm />
        )}
      </main>

      {/* Pied de page */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t border-gray-200 mt-12">
        <p>© 2025 Yazaki Morocco Meknes - Skills Matrix Application</p>
        <p className="mt-1 text-xs">Tous droits réservés</p>
      </footer>
    </div>
  );
}

export default App;
