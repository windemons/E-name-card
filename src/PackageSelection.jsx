import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faCheck } from '@fortawesome/free-solid-svg-icons';

export default function PackageSelection({ onPackageSelect, onBackToHome }) {
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleSelectPackage = (packageType) => {
    // Only set selected, DO NOT navigate immediately
    setSelectedPackage(packageType);
  };

  const handleConfirmPackage = () => {
    // Only navigate when clicking the "Select Package" button
    if (selectedPackage) {
      onPackageSelect(selectedPackage);
    } else {
      alert('Please select a package first!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#00343d' }}>
      {/* Back to Home Button */}
      <button
        onClick={onBackToHome}
        className="absolute top-8 left-8 z-50 px-6 py-2 border-2 border-white text-white rounded-full font-medium hover:bg-white transition-all duration-300 flex items-center gap-2"
        style={{ color: 'white' }}
        onMouseEnter={(e) => e.target.style.color = '#00343d'}
        onMouseLeave={(e) => e.target.style.color = 'white'}
      >
        <span>←</span> Back to Home
      </button>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="max-w-5xl w-full">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose the Right Package for You
            </h2>
            <p className="text-white/70 text-lg">
              Select Personal or Business package to start creating your e-name card
            </p>
          </div>

          {/* Package Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Personal Package */}
            <div
              onClick={() => handleSelectPackage('personal')}
              className={`relative bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                selectedPackage === 'personal' ? 'ring-4 ring-yellow-400 scale-105' : ''
              }`}
              style={{ border: '3px solid #00343d' }}
            >
              {selectedPackage === 'personal' && (
                <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ffcb66' }}>
                  <FontAwesomeIcon icon={faCheck} className="text-2xl text-black" />
                </div>
              )}

              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#00343d' }}>
                  <FontAwesomeIcon icon={faUser} className="text-4xl text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-2" style={{ color: '#00343d' }}>
                  Personal
                </h3>
              </div>

              <ul className="space-y-3 text-left">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-1">✓</span>
                  <span className="text-gray-700">
                    Create personal business cards with complete information, flexible display and sharing options
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-1">✓</span>
                  <span className="text-gray-700">
                    Diverse theme library, suitable for various styles – from minimalist to standout
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-1">✓</span>
                  <span className="text-gray-700">
                    Smart contact management, easily store and track contacts who have "added as friend"
                  </span>
                </li>
              </ul>

              <div className="mt-8">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click bubble to card
                    handleConfirmPackage();
                  }}
                  disabled={selectedPackage !== 'personal'}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                    selectedPackage === 'personal' 
                      ? 'hover:scale-105 cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{ backgroundColor: '#00343d' }}
                >
                  Select Personal Package
                </button>
              </div>
            </div>

            {/* Business Package */}
            <div
              onClick={() => handleSelectPackage('business')}
              className={`relative bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                selectedPackage === 'business' ? 'ring-4 ring-yellow-400 scale-105' : ''
              }`}
              style={{ border: '3px solid #00343d' }}
            >
              {selectedPackage === 'business' && (
                <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ffcb66' }}>
                  <FontAwesomeIcon icon={faCheck} className="text-2xl text-black" />
                </div>
              )}

              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#00343d' }}>
                  <FontAwesomeIcon icon={faBuilding} className="text-4xl text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-2" style={{ color: '#00343d' }}>
                  Business
                </h3>
              </div>

              <ul className="space-y-3 text-left">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-1">✓</span>
                  <span className="text-gray-700">
                    Professional business themes, strong brand identity, across the entire company
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-1">✓</span>
                  <span className="text-gray-700">
                    Flexible permission management, allowing admin to edit, update, and control employee information
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-1">✓</span>
                  <span className="text-gray-700">
                    Centralized management system, helping admin track, store, and manage all employee connections
                  </span>
                </li>
              </ul>

              <div className="mt-8">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click bubble to card
                    handleConfirmPackage();
                  }}
                  disabled={selectedPackage !== 'business'}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                    selectedPackage === 'business' 
                      ? 'hover:scale-105 cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{ backgroundColor: '#00343d' }}
                >
                  Select Business Package
                </button>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">
              💡 You can change your package anytime in the settings
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}