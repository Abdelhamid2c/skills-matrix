/**
 * Welcome - Home page of the Skills Matrix application
 */

import React from 'react';

const Welcome = ({ onGetStarted, onNavigateToLogin }) => {

  const handleGetStartedClick = (e) => {
    e.preventDefault();
    console.log('Start button clicked - Redirecting to Login');
    console.log('═══════════════════════════════════════════════════════');

    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        {/* Main content */}
        <div className="text-center mb-12 animate-fade-in">
          {/* Main title */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to
            <span className="block text-yazaki-red mt-2">Skills Matrix</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Skills management and assessment platform for Yazaki Morocco Meknes
          </p>

          {/* CTA Button */}
          <button
            type="button"
            onClick={handleGetStartedClick}
            className="inline-flex items-center px-8 py-4 bg-yazaki-red text-white text-lg font-semibold rounded-lg hover:bg-yazaki-dark-red transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start
            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 animate-slide-in">
            <div className="w-16 h-16 bg-gradient-to-br from-yazaki-red to-red-600 rounded-lg flex items-center justify-center mb-6 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Profile Management
            </h3>
            <p className="text-gray-600">
              Create and manage your collaborators' profiles with all their professional information.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 animate-slide-in" style={{animationDelay: '0.1s'}}>
            <div className="w-16 h-16 bg-gradient-to-br from-yazaki-red to-red-600 rounded-lg flex items-center justify-center mb-6 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Skills Assessment
            </h3>
            <p className="text-gray-600">
              Assess and track the evolution of your teams' technical skills in real time.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 animate-slide-in" style={{animationDelay: '0.2s'}}>
            <div className="w-16 h-16 bg-gradient-to-br from-yazaki-red to-red-600 rounded-lg flex items-center justify-center mb-6 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Detailed Reports
            </h3>
            <p className="text-gray-600">
              Generate comprehensive reports and view your organization's skills statistics.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-yazaki-red to-red-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">Collaborators</div>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-90">Skills Assessed</div>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.5s'}}>
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="text-lg opacity-90">Departments</div>
            </div>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="mt-12 text-center animate-fade-in" style={{animationDelay: '0.6s'}}>
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border-2 border-gray-200">
            <svg className="w-5 h-5 text-yazaki-red mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700 font-medium">Developed by</span>
            <span className="ml-2 font-bold text-yazaki-red">Abdelhamid Chebel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
