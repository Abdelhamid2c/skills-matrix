/**
 * App.js - Composant principal de l'application Skills Matrix
 * Gère la structure globale et le routage de l'application
 */

import React from 'react';
import Header from './components/Header';
import CollaboratorForm from './components/CollaboratorForm';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* En-tête de l'application */}
      <Header />

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        <CollaboratorForm />
      </main>

      {/* Pied de page */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>© 2025 Yazaki Morocco Meknes - Skills Matrix Application</p>
      </footer>
    </div>
  );
}

export default App;
