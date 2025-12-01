/**
 * Header - En-tête de l'application avec logo Yazaki
 */

import React from 'react';

const Header = () => {
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

          {/* Badge de version */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="px-3 py-1 bg-yazaki-red text-white text-sm font-semibold rounded-full">
              v1.0
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
