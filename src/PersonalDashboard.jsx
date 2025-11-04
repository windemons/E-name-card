import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faIdCard, 
  faAddressBook, 
  faPlus, 
  faEdit, 
  faTrash, 
  faShare,
  faQrcode,
  faEye,
  faChevronDown,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import CardPreview from './CardPreview';

export default function PersonalDashboard({ onLogout, onBackToHome, onEditCard }) {
  const [selectedMenu, setSelectedMenu] = useState('cards');
  const [activeTab, setActiveTab] = useState('cardview'); // 'cardview' or 'qrcode'
  const [selectedCard, setSelectedCard] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data - sau này sẽ lấy từ API
  const [cards, setCards] = useState([
    {
      id: 1,
      name: 'Personal',
      type: 'personal',
      theme: 'gradient',
      isActive: true
    }
  ]);

  const handleCreateCard = () => {
    alert('Chức năng tạo card mới - Coming soon!');
  };

  const handleEditCard = () => {
    if (onEditCard) {
      onEditCard();
    }
  };

  const handleDeleteCard = () => {
    if (confirm('Bạn có chắc muốn xóa card này?')) {
      alert('Đã xóa card!');
    }
  };

  const handleShareCard = () => {
    alert('Chức năng share card - Coming soon!');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#00343d' }}>
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 border-r border-white/10 flex flex-col`}
        style={{ backgroundColor: '#003540' }}
      >
        {sidebarOpen && (
          <>
            {/* Logo - CLICKABLE TO GO HOME */}
            <div className="p-6 border-b border-white/10">
              <button 
                onClick={onBackToHome}
                className="hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-0 p-0"
              >
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-white leading-none">Cosma</h1>
                  <img 
                    src="/Logo.png"
                    alt="Cosma Logo" 
                    className="object-contain pointer-events-none"
                    style={{ 
                      width: '70px',
                      height: '50px',
                      transform: 'rotate(-20deg)',
                      marginLeft: '-20px',
                      marginTop: '0px'
                    }}
                  />
                </div>
              </button>
            </div>

            {/* User dropdown */}
            <div className="p-4 border-b border-white/10">
              <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/5 transition-all text-white">
                <span className="font-medium">Personal</span>
                <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
              </button>
            </div>

            {/* Menu items */}
            <nav className="flex-1 p-4">
              <button
                onClick={() => setSelectedMenu('cards')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-2 ${
                  selectedMenu === 'cards'
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <FontAwesomeIcon icon={faIdCard} className="text-lg" />
                <span className="font-medium">Cards</span>
              </button>

              <button
                onClick={() => setSelectedMenu('contacts')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  selectedMenu === 'contacts'
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <FontAwesomeIcon icon={faAddressBook} className="text-lg" />
                <span className="font-medium">Contacts</span>
              </button>
            </nav>
          </>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="border-b border-white/10 p-4" style={{ backgroundColor: '#003540' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Toggle sidebar button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/5 text-white transition-all"
              >
                <FontAwesomeIcon icon={faBars} className="text-xl" />
              </button>

              {/* Cards title */}
              {selectedMenu === 'cards' && (
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-white">Cards</h2>
                  <button
                    onClick={handleCreateCard}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                    style={{ backgroundColor: '#ffcb66', color: '#000' }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Create
                  </button>
                </div>
              )}
            </div>

            {/* Right side buttons - Move Edit and Delete here */}
            <div className="flex items-center gap-3">
              {selectedMenu === 'cards' && (
                <>
                  <button
                    onClick={handleEditCard}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDeleteCard}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    <span>Delete</span>
                  </button>
                </>
              )}
              <button
                onClick={handleShareCard}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                style={{ backgroundColor: '#ffcb66', color: '#000' }}
              >
                <FontAwesomeIcon icon={faShare} />
                <span>Share card</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 p-6 overflow-auto">
          {selectedMenu === 'cards' ? (
            <div className="h-full">
              {/* Card types tabs and View toggle in one row */}
              <div className="mb-4 flex items-center justify-between">
                {/* Personal tab */}
                <div className="flex items-center gap-4">
                  <button className="px-4 py-2 text-white font-medium border-b-2 border-white">
                    Card Selection
                  </button>
                </div>

                {/* Card view / QR code tabs */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveTab('cardview')}
                    className={`px-4 py-2 font-medium transition-all ${
                      activeTab === 'cardview'
                        ? 'text-white border-b-2 border-white'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    Card view
                  </button>
                  <button
                    onClick={() => setActiveTab('qrcode')}
                    className={`px-4 py-2 font-medium transition-all ${
                      activeTab === 'qrcode'
                        ? 'text-white border-b-2 border-white'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faQrcode} className="mr-2" />
                    QR Code
                  </button>
                </div>
              </div>

              {/* Card preview area - centered with reduced top margin */}
              <div className="flex justify-center items-start pt-4">
                {activeTab === 'cardview' ? (
                  <CardPreview />
                ) : (
                  <div className="w-80 h-80 bg-white rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <FontAwesomeIcon icon={faQrcode} className="text-6xl text-gray-400 mb-4" />
                      <p className="text-gray-600">QR Code will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Contacts view
            <div className="text-center text-white py-20">
              <FontAwesomeIcon icon={faAddressBook} className="text-6xl mb-4 opacity-50" />
              <h3 className="text-2xl font-bold mb-2">Contacts</h3>
              <p className="text-white/70">Quản lý danh bạ của bạn - Coming soon!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}