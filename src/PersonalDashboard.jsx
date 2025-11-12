import React, { useState, useEffect } from 'react';
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
  faBars,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import CardPreview from './CardPreview';
import QRCodeDisplay from './QRCodeDisplay';
import ContactsDashboard from './ContactsDashboard';
import ShareCardModal from './ShareCardModal';

export default function PersonalDashboard({ onLogout, onBackToHome, onEditCard }) {
  const [selectedMenu, setSelectedMenu] = useState('cards');
  const [activeTab, setActiveTab] = useState('cardview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  // Cards state - load from localStorage
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('cosma_all_cards');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : [createDefaultCard()];
      } catch (e) {
        return [createDefaultCard()];
      }
    }
    return [createDefaultCard()];
  });

  const [selectedCardId, setSelectedCardId] = useState(() => {
    return cards[0]?.id || null;
  });

  // Reload cards when refreshTrigger changes
  useEffect(() => {
    const saved = localStorage.getItem('cosma_all_cards');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCards(parsed);
      } catch (e) {
        console.error('Failed to reload cards');
      }
    }
  }, [refreshTrigger]);

  // Reload cards when component mounts or becomes visible (after editing)
  useEffect(() => {
    const reloadCards = () => {
      setRefreshTrigger(prev => prev + 1);
    };

    // Reload when window gets focus (coming back from editor)
    window.addEventListener('focus', reloadCards);
    
    // Also reload on visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        reloadCards();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', reloadCards);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Save cards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cosma_all_cards', JSON.stringify(cards));
  }, [cards]);

  // Load selected card data to main editor storage
  useEffect(() => {
    const selectedCard = cards.find(c => c.id === selectedCardId);
    if (selectedCard) {
      localStorage.setItem('cosma_card_data', JSON.stringify(selectedCard.data));
      // Also save the card ID so editor knows which card to update
      localStorage.setItem('cosma_current_card_id', selectedCardId.toString());
    }
  }, [selectedCardId, cards]);

  // Create default empty card
  function createDefaultCard() {
    return {
      id: Date.now(),
      name: 'Untitled Card',
      data: {
        name: '',
        title: '',
        company: '',
        phone: '',
        email: '',
        location: '',
        website: '',
        avatar: null,
        brandPhoto: null,
        theme: 'classic',
        sticker: null,
        colorTheme: { id: 'default', name: 'Teal Classic', primary: '#00343d', accent: '#3b82f6' },
        fontStyle: { id: 'default', name: 'Default', family: 'system-ui, -apple-system, sans-serif' },
        socials: {
          facebook: '',
          linkedin: '',
          github: '',
          twitter: ''
        }
      },
      createdAt: new Date().toISOString()
    };
  }

  const handleCreateCard = () => {
    const newCard = createDefaultCard();
    setCards(prev => [...prev, newCard]);
    setSelectedCardId(newCard.id);
  };

  const handleSelectCard = (cardId) => {
    setSelectedCardId(cardId);
  };

  const handleEditCard = () => {
    if (onEditCard) {
      // Save current card ID for editor
      localStorage.setItem('cosma_editing_card_id', selectedCardId.toString());
      onEditCard();
    }
  };

  const handleDeleteCard = () => {
    if (cards.length === 1) {
      alert('Bạn phải có ít nhất 1 card!');
      return;
    }

    if (confirm('Bạn có chắc muốn xóa card này?')) {
      const remainingCards = cards.filter(c => c.id !== selectedCardId);
      setCards(remainingCards);
      // Select first remaining card
      setSelectedCardId(remainingCards[0].id);
    }
  };

  const handleShareCard = () => {
    setShareModalOpen(true);
  };

  // Get currently selected card
  const selectedCard = cards.find(c => c.id === selectedCardId);

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

              {/* Title */}
              <h2 className="text-2xl font-bold text-white">
                {selectedMenu === 'cards' ? 'Cards' : 'Contacts'}
              </h2>

              {/* Create button (only for Cards view) */}
              {selectedMenu === 'cards' && (
                <button
                  onClick={handleCreateCard}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: '#ffcb66', color: '#000' }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Create
                </button>
              )}
            </div>

            {/* Right side buttons - only for Cards view */}
            {selectedMenu === 'cards' && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleEditCard}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDeleteCard}
                  disabled={cards.length === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white transition-all ${
                    cards.length === 1 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-red-500/10 hover:border-red-500'
                  }`}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span>Delete</span>
                </button>
                <button
                  onClick={handleShareCard}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: '#ffcb66', color: '#000' }}
                >
                  <FontAwesomeIcon icon={faShare} />
                  <span>Share card</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 flex overflow-hidden">
          {selectedMenu === 'cards' ? (
            <>
              {/* Left side - Card Selection (vertical list) */}
              <div className="w-80 border-r border-white/10 p-4 overflow-y-auto" style={{ backgroundColor: '#003540' }}>
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                  Card Selection ({cards.length})
                </h3>
                
                <div className="space-y-3">
                  {cards.map((card, index) => (
                    <button
                      key={card.id}
                      onClick={() => handleSelectCard(card.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all border-2 ${
                        selectedCardId === card.id
                          ? 'bg-[#ffcb66] border-[#ffcb66] text-black'
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <FontAwesomeIcon icon={faIdCard} className="text-sm" />
                            <span className="font-bold text-sm">
                              {card.data.name || card.name}
                            </span>
                          </div>
                          {card.data.title && (
                            <p className="text-xs opacity-75 mb-1">{card.data.title}</p>
                          )}
                          {card.data.company && (
                            <p className="text-xs opacity-60">{card.data.company}</p>
                          )}
                        </div>
                        {selectedCardId === card.id && (
                          <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center flex-shrink-0">
                            <FontAwesomeIcon icon={faCheck} className="text-xs" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs opacity-60 mt-2 pt-2 border-t border-current/20">
                        <span>Theme: {card.data.theme}</span>
                        <span>#{index + 1}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right side - Card Preview */}
              <div className="flex-1 overflow-auto">
                <div className="p-6">
                  {/* Card view / QR code tabs */}
                  <div className="flex items-center justify-end gap-4 mb-6">
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

                  {/* Card preview area - centered */}
                  <div className="flex justify-center items-start pt-4">
                    {activeTab === 'cardview' ? (
                      <CardPreview cardData={selectedCard?.data} />
                    ) : (
                      <QRCodeDisplay cardData={selectedCard?.data} />
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Contacts view - FULL COMPONENT
            <ContactsDashboard />
          )}
        </div>
      </main>

      {/* Share Card Modal */}
      <ShareCardModal 
        cardData={selectedCard?.data}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
}