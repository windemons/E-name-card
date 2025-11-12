import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faChevronUp, 
  faImage, 
  faSave,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import CardPreview from "./CardPreview";
import ImageCropModal from "./ImageCropModal";
import DesignTab from "./DesignTab";
import QRTab from "./QRTab";
import QRPreview from "./QRPreview";

export default function CardEditor({ onBack }) {
  const [cardData, setCardData] = useState(() => {
    const saved = localStorage.getItem('cosma_card_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved data');
      }
    }
    return {
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
      // QR Code customization fields
      qrShape: 'none',
      qrSticker: 'none',
      qrCenterIcon: null,
      qrLogo: null,
      socials: {
        facebook: '',
        linkedin: '',
        github: '',
        twitter: ''
      }
    };
  });

  const [activeTab, setActiveTab] = useState('customize');
  const [sections, setSections] = useState({
    profile: true,
    company: true,
    contact: true,
    socialLinks: true
  });
  const [expandedSection, setExpandedSection] = useState('profile');
  const [saveStatus, setSaveStatus] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropModalImage, setCropModalImage] = useState(null);
  const [cropModalType, setCropModalType] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('cosma_card_data', JSON.stringify(cardData));
      } catch (err) {
        if (err.name === 'QuotaExceededError') {
          console.warn('Auto-save failed: Storage quota exceeded');
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [cardData]);

  const updateCardData = (field, value) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedField = (parent, field, value) => {
    setCardData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const toggleSection = (sectionName) => {
    setSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const toggleExpanded = (sectionName) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropModalImage(reader.result);
        setCropModalType('avatar');
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleBrandPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropModalImage(reader.result);
        setCropModalType('logo');
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleCropSave = (croppedImage) => {
    if (cropModalType === 'avatar') {
      updateCardData('avatar', croppedImage);
    } else if (cropModalType === 'logo') {
      updateCardData('brandPhoto', croppedImage);
    }
    setShowCropModal(false);
  };

  const handleSave = () => {
    setSaveStatus('saving');
    
    try {
      // Save to main card data
      localStorage.setItem('cosma_card_data', JSON.stringify(cardData));
      
      // Also update the card in the all cards list
      const currentCardId = localStorage.getItem('cosma_current_card_id');
      if (currentCardId) {
        const allCards = JSON.parse(localStorage.getItem('cosma_all_cards') || '[]');
        const cardIndex = allCards.findIndex(c => c.id === parseInt(currentCardId));
        
        if (cardIndex !== -1) {
          allCards[cardIndex].data = cardData;
          // Update card name from data if available
          if (cardData.name) {
            allCards[cardIndex].name = cardData.name;
          }
          
          try {
            localStorage.setItem('cosma_all_cards', JSON.stringify(allCards));
          } catch (err) {
            // If quota exceeded, try saving with lightweight data
            if (err.name === 'QuotaExceededError') {
              console.warn('Storage quota exceeded, saving with lightweight data');
              
              // Create lightweight version without images for the list
              const lightCard = {
                ...allCards[cardIndex],
                data: {
                  ...cardData,
                  avatar: null,  // Remove heavy images from list
                  brandPhoto: null
                }
              };
              allCards[cardIndex] = lightCard;
              
              // Try again with lightweight data
              localStorage.setItem('cosma_all_cards', JSON.stringify(allCards));
              
              // Main card data still has images
              localStorage.setItem('cosma_card_data', JSON.stringify(cardData));
            } else {
              throw err;
            }
          }
        }
      }
      
      setTimeout(() => {
        setSaveStatus('saved');
        console.log('Card saved:', cardData);
        setTimeout(() => {
          setSaveStatus('');
        }, 2000);
      }, 500);
      
    } catch (error) {
      console.error('Error saving card:', error);
      setSaveStatus('');
      
      if (error.name === 'QuotaExceededError') {
        alert('Storage full! Try removing some images or clear browser data.');
      } else {
        alert('Failed to save card. Please try again.');
      }
    }
  };

  // Theme selector handler
  const handleThemeChange = (themeName) => {
    updateCardData('theme', themeName);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#003540' }}>
      {/* Header - COMPACT */}
      <header className="px-6 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white">
            Cosma<span className="text-xl">🚀</span>
          </h1>
          <button
            onClick={onBack}
            className="px-3 py-1.5 border-2 border-white text-white rounded-full text-sm font-medium hover:bg-white hover:text-[#003540] transition-all"
          >
            ← Back
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('customize')}
            className={`px-5 py-1.5 rounded-full font-medium transition-all text-sm ${
              activeTab === 'customize'
                ? 'bg-[#ffcb66] text-black'
                : 'bg-transparent text-white border border-white/30 hover:bg-white/10'
            }`}
          >
            Customize
          </button>
          <span className="text-white/50 text-sm">→</span>
          <button
            onClick={() => setActiveTab('design')}
            className={`px-5 py-1.5 rounded-full font-medium transition-all text-sm ${
              activeTab === 'design'
                ? 'bg-[#ffcb66] text-black'
                : 'bg-transparent text-white border border-white/30 hover:bg-white/10'
            }`}
          >
            Design
          </button>
          <span className="text-white/50 text-sm">→</span>
          <button
            onClick={() => setActiveTab('qrcode')}
            className={`px-5 py-1.5 rounded-full font-medium transition-all text-sm ${
              activeTab === 'qrcode'
                ? 'bg-[#ffcb66] text-black'
                : 'bg-transparent text-white border border-white/30 hover:bg-white/10'
            }`}
          >
            QR Code
          </button>
        </div>

        {/* THEME SELECTOR - 4 Themes */}
        <div className="flex items-center gap-3">
          <span className="text-white text-sm font-medium mr-2">Card Theme:</span>
          
          {/* Theme 1: Classic */}
          <button
            onClick={() => handleThemeChange('classic')}
            className={`relative w-16 h-10 rounded-lg transition-all overflow-hidden border-2 ${
              cardData.theme === 'classic' 
                ? 'border-[#ffcb66] scale-110' 
                : 'border-white/30 hover:border-white/60'
            }`}
            title="Classic Theme"
          >
            <div className="absolute inset-0 flex">
              <div className="w-1/2 bg-[#00343d]"></div>
              <div className="w-1/2 bg-white"></div>
            </div>
            {cardData.theme === 'classic' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <FontAwesomeIcon icon={faCheck} className="text-[#ffcb66] text-lg" />
              </div>
            )}
          </button>

          {/* Theme 2: Arrow */}
          <button
            onClick={() => handleThemeChange('arrow')}
            className={`relative w-16 h-10 rounded-lg transition-all overflow-hidden border-2 ${
              cardData.theme === 'arrow' 
                ? 'border-[#ffcb66] scale-110' 
                : 'border-white/30 hover:border-white/60'
            }`}
            title="Arrow Theme"
          >
            <div className="absolute inset-0 flex">
              <svg viewBox="0 0 64 40" className="w-full h-full">
                <path d="M 0 0 L 48 0 L 56 20 L 48 40 L 0 40 Z" fill="#00343d"/>
                <rect x="48" y="0" width="16" height="40" fill="white"/>
              </svg>
            </div>
            {cardData.theme === 'arrow' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <FontAwesomeIcon icon={faCheck} className="text-[#ffcb66] text-lg" />
              </div>
            )}
          </button>

          {/* Theme 3: Shield */}
          <button
            onClick={() => handleThemeChange('shield')}
            className={`relative w-16 h-10 rounded-lg transition-all overflow-hidden border-2 ${
              cardData.theme === 'shield' 
                ? 'border-[#ffcb66] scale-110' 
                : 'border-white/30 hover:border-white/60'
            }`}
            title="Shield Theme"
          >
            <div className="absolute inset-0 bg-white">
              <svg viewBox="0 0 64 40" className="w-full h-full">
                <path d="M 20 0 L 44 0 L 52 6 L 52 34 L 32 40 L 12 34 L 12 6 Z" fill="#00343d"/>
              </svg>
            </div>
            {cardData.theme === 'shield' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <FontAwesomeIcon icon={faCheck} className="text-[#ffcb66] text-lg" />
              </div>
            )}
          </button>

          {/* Theme 4: Wave */}
          <button
            onClick={() => handleThemeChange('wave')}
            className={`relative w-16 h-10 rounded-lg transition-all overflow-hidden border-2 ${
              cardData.theme === 'wave' 
                ? 'border-[#ffcb66] scale-110' 
                : 'border-white/30 hover:border-white/60'
            }`}
            title="Wave Theme"
          >
            <div className="absolute inset-0 bg-white">
              <svg viewBox="0 0 64 40" className="w-full h-full">
                <path d="M 0 0 L 48 0 Q 56 10 52 20 Q 48 30 56 40 L 0 40 Z" fill="#00343d"/>
              </svg>
            </div>
            {cardData.theme === 'wave' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <FontAwesomeIcon icon={faCheck} className="text-[#ffcb66] text-lg" />
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-screen" style={{ height: 'calc(100vh - 60px)' }}>
        {/* Left Panel - Form sections or Design Tab or QR Tab */}
        <div className="w-1/2 p-4 space-y-2.5 overflow-y-auto border-r border-white/10 custom-scrollbar">
          
          {activeTab === 'design' ? (
            <DesignTab cardData={cardData} updateCardData={updateCardData} />
          ) : activeTab === 'qrcode' ? (
            <QRTab cardData={cardData} updateCardData={updateCardData} />
          ) : activeTab === 'customize' ? (
            <>
          {/* Profile Section */}
          <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => toggleExpanded('profile')}
                className="flex items-center gap-3 flex-1"
              >
                <span className="text-base font-semibold text-gray-800">Profile</span>
                <FontAwesomeIcon 
                  icon={expandedSection === 'profile' ? faChevronUp : faChevronDown} 
                  className="text-gray-600 text-sm"
                />
              </button>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sections.profile}
                  onChange={() => toggleSection('profile')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ffcb66]"></div>
              </label>
            </div>

            {expandedSection === 'profile' && sections.profile && (
              <div className="px-4 pb-4 space-y-3">
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Profile Photo</label>
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-white/50 hover:bg-white/70 transition-all overflow-hidden group">
                      {cardData.avatar ? (
                        <div className="relative w-full h-full">
                          <img src={cardData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                            <span className="text-white text-xs font-medium">Click to change</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <FontAwesomeIcon icon={faImage} className="text-2xl text-gray-400 mb-1.5" />
                          <span className="text-xs text-gray-500">Click to upload</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                    {cardData.avatar && (
                      <button onClick={() => updateCardData('avatar', null)} className="mt-1.5 w-full text-[10px] text-red-600 hover:text-red-800 font-medium">Remove</button>
                    )}
                  </div>

                  {/* Brand Logo */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Brand Logo</label>
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-white/50 hover:bg-white/70 transition-all overflow-hidden group">
                      {cardData.brandPhoto ? (
                        <div className="relative w-full h-full">
                          <img src={cardData.brandPhoto} alt="Brand" className="w-full h-full object-contain p-2" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                            <span className="text-white text-xs font-medium">Click to change</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <FontAwesomeIcon icon={faImage} className="text-2xl text-gray-400 mb-1.5" />
                          <span className="text-xs text-gray-500">Click to upload</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleBrandPhotoUpload} className="hidden" />
                    </label>
                    {cardData.brandPhoto && (
                      <button onClick={() => updateCardData('brandPhoto', null)} className="mt-1.5 w-full text-[10px] text-red-600 hover:text-red-800 font-medium">Remove</button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input type="text" value={cardData.name} onChange={(e) => updateCardData('name', e.target.value)} placeholder="John Doe" className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm" />
                </div>
              </div>
            )}
          </div>

          {/* Company Info Section */}
          <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <button onClick={() => toggleExpanded('company')} className="flex items-center gap-3 flex-1">
                <span className="text-base font-semibold text-gray-800">Company Info</span>
                <FontAwesomeIcon icon={expandedSection === 'company' ? faChevronUp : faChevronDown} className="text-gray-600 text-sm" />
              </button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={sections.company} onChange={() => toggleSection('company')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ffcb66]"></div>
              </label>
            </div>
            {expandedSection === 'company' && sections.company && (
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Company Name</label>
                  <input type="text" value={cardData.company} onChange={(e) => updateCardData('company', e.target.value)} placeholder="Cosma Tech" className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Job Title</label>
                  <input type="text" value={cardData.title} onChange={(e) => updateCardData('title', e.target.value)} placeholder="Full Stack Developer" className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm" />
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <button onClick={() => toggleExpanded('contact')} className="flex items-center gap-3 flex-1">
                <span className="text-base font-semibold text-gray-800">Contact Information</span>
                <FontAwesomeIcon icon={expandedSection === 'contact' ? faChevronUp : faChevronDown} className="text-gray-600 text-sm" />
              </button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={sections.contact} onChange={() => toggleSection('contact')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ffcb66]"></div>
              </label>
            </div>
            {expandedSection === 'contact' && sections.contact && (
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Email *</label>
                  <input type="email" value={cardData.email} onChange={(e) => updateCardData('email', e.target.value)} placeholder="john@example.com" className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Phone Number *</label>
                  <input type="tel" value={cardData.phone} onChange={(e) => updateCardData('phone', e.target.value)} placeholder="+84 123 456 789" className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Location</label>
                  <input type="text" value={cardData.location} onChange={(e) => updateCardData('location', e.target.value)} placeholder="Ho Chi Minh City, Vietnam" className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Website</label>
                  <input type="text" value={cardData.website} onChange={(e) => updateCardData('website', e.target.value)} placeholder="www.example.com" className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm" />
                </div>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <button onClick={() => toggleExpanded('socialLinks')} className="flex items-center gap-3 flex-1">
                <span className="text-base font-semibold text-gray-800">Social Links</span>
                <FontAwesomeIcon icon={expandedSection === 'socialLinks' ? faChevronUp : faChevronDown} className="text-gray-600 text-sm" />
              </button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={sections.socialLinks} onChange={() => toggleSection('socialLinks')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ffcb66]"></div>
              </label>
            </div>
            {expandedSection === 'socialLinks' && sections.socialLinks && (
              <div className="px-4 pb-4 space-y-2.5">
                <input type="url" value={cardData.socials.facebook} onChange={(e) => updateNestedField('socials', 'facebook', e.target.value)} placeholder="https://facebook.com/yourprofile" className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm" />
                <input type="url" value={cardData.socials.linkedin} onChange={(e) => updateNestedField('socials', 'linkedin', e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm" />
                <input type="url" value={cardData.socials.github} onChange={(e) => updateNestedField('socials', 'github', e.target.value)} placeholder="https://github.com/yourprofile" className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm" />
                <input type="url" value={cardData.socials.twitter} onChange={(e) => updateNestedField('socials', 'twitter', e.target.value)} placeholder="https://twitter.com/yourprofile" className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm" />
              </div>
            )}
          </div>

            </>
          ) : null}

        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 flex flex-col" style={{ backgroundColor: '#004d5c' }}>
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white text-base font-semibold text-center">Live Preview</h3>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto custom-scrollbar">
            {activeTab === 'qrcode' ? (
              <QRPreview cardData={cardData} />
            ) : (
              <CardPreview cardData={cardData} />
            )}
          </div>
          
          <div className="p-4 border-t border-white/10 flex justify-center">
            <button 
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-8 py-2.5 bg-[#ffcb66] text-black rounded-lg font-semibold hover:scale-105 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 text-sm"
            >
              {saveStatus === 'saving' && <span className="animate-spin">⏳</span>}
              {saveStatus === 'saved' && <FontAwesomeIcon icon={faCheck} />}
              {saveStatus === '' && <FontAwesomeIcon icon={faSave} />}
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {showCropModal && (
        <ImageCropModal
          image={cropModalImage}
          onClose={() => setShowCropModal(false)}
          onSave={handleCropSave}
          aspectRatio={cropModalType === 'avatar' ? 1 : 1}
          cropShape={cropModalType === 'avatar' ? 'round' : 'rect'}
          showBackgroundRemoval={cropModalType === 'logo'}
        />
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}