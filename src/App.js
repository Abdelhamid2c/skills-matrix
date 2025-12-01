/**
 * App.js - Composant principal de l'application Skills Matrix
 * Gère la navigation entre les différentes pages
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Loading from './components/Loading';
import Questionnaire from './components/Questionnaire';
import CollaboratorForm from './components/CollaboratorForm';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome'); // welcome, login, loading, questionnaire, form
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginClick = () => {
    console.log('Navigation vers Login');
    setCurrentPage('login');
  };

  const handleSignInClick = () => {
    console.log('Navigation vers Formulaire (Sign In)');
    // Sign In = Accès direct au formulaire pour créer un nouveau collaborateur
    setCurrentPage('form');
  };

  const handleBackToWelcome = () => {
    console.log('Retour vers Welcome');
    setCurrentPage('welcome');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleGetStarted = () => {
    console.log('Get Started clicked');
    // Rediriger vers le formulaire directement
    setCurrentPage('form');
  };

  const handleLoginSuccess = (userData) => {
    console.log('Login réussi:', userData);
    setIsAuthenticated(true);
    setCurrentUser(userData);

    // Afficher la page de chargement
    setCurrentPage('loading');
  };

  // Effet pour passer de la page loading au questionnaire après 3 secondes
  useEffect(() => {
    if (currentPage === 'loading') {
      const timer = setTimeout(() => {
        console.log('Redirection vers le questionnaire');
        setCurrentPage('questionnaire');
      }, 3000); // 3 secondes de chargement

      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  // Debug: Afficher la page actuelle
  console.log('Page actuelle:', currentPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* En-tête de l'application */}
      <Header
        onLoginClick={handleLoginClick}
        onSignInClick={handleSignInClick}
        onBackClick={handleBackToWelcome}
        showAuthButtons={currentPage === 'welcome'}
        showBackButton={currentPage !== 'welcome' && currentPage !== 'loading'}
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

        {currentPage === 'loading' && (
          <Loading userName={currentUser?.matricule} />
        )}

        {currentPage === 'questionnaire' && (
          <Questionnaire
            currentUser={currentUser}
            onBack={handleBackToWelcome}
          />
        )}

        {currentPage === 'form' && (
          <CollaboratorForm
            currentUser={currentUser}
            onBack={handleBackToWelcome}
          />
        )}
      </main>

      {/* Pied de page */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t border-gray-200 mt-12">
        <p>© 2025 Yazaki Morocco Meknes - Skills Matrix Application</p>
        <p className="mt-1 text-xs">Tous droits réservés</p>
        {isAuthenticated && currentUser && currentPage !== 'loading' && (
          <p className="mt-2 text-xs text-yazaki-red font-semibold">
            Connecté en tant que: {currentUser.matricule}
          </p>
        )}
      </footer>
    </div>
  );
}

export default App;
