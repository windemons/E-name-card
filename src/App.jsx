import React, { useState, useEffect } from 'react';
import HomePage from './HomePage';
import LoginRegister from './LoginRegister';
import PackageSelection from './PackageSelection';
import PersonalDashboard from './PersonalDashboard';
import CardEditorCustomize from './CardEditorCustomize';
import PublicCardView from './PublicCardView';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [sharedCardId, setSharedCardId] = useState(null);

  // Check URL on mount for shared card links
  useEffect(() => {
    const path = window.location.pathname;
    
    // Check if URL is /card/:id
    if (path.startsWith('/card/')) {
      const cardId = path.split('/card/')[1];
      if (cardId) {
        setSharedCardId(cardId);
        setCurrentPage('publicCard');
      }
    }
  }, []);

  // Handler cho việc chuyển trang
  const handleSignInClick = () => {
    setCurrentPage('login');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSharedCardId(null);
    // Reset URL to home
    window.history.pushState({}, '', '/');
  };

  const handleLoginSuccess = () => {
    // Sau khi đăng nhập thành công, chuyển đến trang chọn gói
    setCurrentPage('packageSelection');
  };

  const handlePackageSelect = (packageType) => {
    setSelectedPackage(packageType);
    console.log('Selected package:', packageType);
    
    // Chuyển đến dashboard tương ứng
    if (packageType === 'personal') {
      setCurrentPage('personalDashboard');
    } else if (packageType === 'business') {
      // TODO: Tạo BusinessDashboard
      alert('Business Dashboard - Coming soon!');
      setCurrentPage('businessDashboard');
    }
  };

  // Routing logic
  if (currentPage === 'login') {
    return <LoginRegister onBackToHome={handleBackToHome} onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === 'packageSelection') {
    return <PackageSelection onPackageSelect={handlePackageSelect} onBackToHome={handleBackToHome} />;
  }

  if (currentPage === 'personalDashboard') {
    return <PersonalDashboard onLogout={() => setCurrentPage('home')} onBackToHome={handleBackToHome} onEditCard={() => setCurrentPage('cardEditor')} />;
  }

  if (currentPage === 'cardEditor') {
    return <CardEditorCustomize onBack={() => setCurrentPage('personalDashboard')} />;
  }

  if (currentPage === 'businessDashboard') {
    // TODO: Create BusinessDashboard component
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Business Dashboard</h1>
          <p className="mb-8">Coming soon...</p>
          <button
            onClick={() => setCurrentPage('home')}
            className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Public Card View - for shared cards
  if (currentPage === 'publicCard' && sharedCardId) {
    return <PublicCardView cardId={sharedCardId} onBackToHome={handleBackToHome} />;
  }

  // Default: HomePage
  return <HomePage onSignInClick={handleSignInClick} />;
}

export default App;