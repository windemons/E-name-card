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
      theme: {
        colors: ['#667eea', '#764ba2', '#f093fb'],
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
      },
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
    headingText: true,
    contactUs: true,
    socialLinks: true
  });
  const [expandedSection, setExpandedSection] = useState('profile');
  const [saveStatus, setSaveStatus] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropModalImage, setCropModalImage] = useState(null);
  const [cropModalType, setCropModalType] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('cosma_card_data', JSON.stringify(cardData));
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

  const applyPresetTheme = (colors) => {
    updateCardData('theme', {
      colors: colors,
      background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`
    });
  };

  const handleSave = () => {
    setSaveStatus('saving');
    localStorage.setItem('cosma_card_data', JSON.stringify(cardData));
    setTimeout(() => {
      setSaveStatus('saved');
      console.log('Card saved:', cardData);
      setTimeout(() => {
        setSaveStatus('');
      }, 2000);
    }, 500);
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

        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => applyPresetTheme(['#667eea', '#764ba2', '#f093fb'])}
              className="w-10 h-10 rounded-lg shadow-lg hover:scale-110 transition-all border-2 border-white/30 hover:border-white/60"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}
              title="Purple Dream"
            />
            <button
              onClick={() => applyPresetTheme(['#FF6B6B', '#FFA500', '#FFD700'])}
              className="w-10 h-10 rounded-lg shadow-lg hover:scale-110 transition-all border-2 border-white/30 hover:border-white/60"
              style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FFA500 50%, #FFD700 100%)' }}
              title="Sunset Orange"
            />
            <button
              onClick={() => applyPresetTheme(['#00C9FF', '#0084FF', '#667eea'])}
              className="w-10 h-10 rounded-lg shadow-lg hover:scale-110 transition-all border-2 border-white/30 hover:border-white/60"
              style={{ background: 'linear-gradient(135deg, #00C9FF 0%, #0084FF 50%, #667eea 100%)' }}
              title="Ocean Blue"
            />
            <button
              onClick={() => applyPresetTheme(['#34D399', '#10B981', '#059669'])}
              className="w-10 h-10 rounded-lg shadow-lg hover:scale-110 transition-all border-2 border-white/30 hover:border-white/60"
              style={{ background: 'linear-gradient(135deg, #34D399 0%, #10B981 50%, #059669 100%)' }}
              title="Emerald Green"
            />
          </div>
        </div>
      </header>

      {/* Main Content - COMPACT */}
      <div className="flex h-screen" style={{ height: 'calc(100vh - 60px)' }}>
        {/* Left Panel - COMPACT + HIDDEN SCROLLBAR */}
        <div className="w-1/2 p-4 space-y-2.5 overflow-y-auto border-r border-white/10 custom-scrollbar">
          
          {/* Profile Section - COMPACT */}
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
                  {/* Avatar - COMPACT */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Profile Photo
                    </label>
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
                          <span className="text-[10px] text-gray-400 mt-0.5">Crop & adjust</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                    {cardData.avatar && (
                      <button
                        onClick={() => updateCardData('avatar', null)}
                        className="mt-1.5 w-full text-[10px] text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Brand Photo - COMPACT */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Brand Logo
                    </label>
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
                          <span className="text-[10px] text-gray-400 mt-0.5">Auto remove BG</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBrandPhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {cardData.brandPhoto && (
                      <button
                        onClick={() => updateCardData('brandPhoto', null)}
                        className="mt-1.5 w-full text-[10px] text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Name - COMPACT */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={cardData.name}
                    onChange={(e) => updateCardData('name', e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm"
                  />
                </div>

                {/* Email - COMPACT */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={cardData.email}
                    onChange={(e) => updateCardData('email', e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm"
                  />
                </div>

                {/* Phone - COMPACT */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={cardData.phone}
                    onChange={(e) => updateCardData('phone', e.target.value)}
                    placeholder="+84 123 456 789"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Heading + Text - COMPACT */}
          <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => toggleExpanded('headingText')}
                className="flex items-center gap-3 flex-1"
              >
                <span className="text-base font-semibold text-gray-800">Heading + Text</span>
                <FontAwesomeIcon 
                  icon={expandedSection === 'headingText' ? faChevronUp : faChevronDown} 
                  className="text-gray-600 text-sm"
                />
              </button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sections.headingText}
                  onChange={() => toggleSection('headingText')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ffcb66]"></div>
              </label>
            </div>
            {expandedSection === 'headingText' && sections.headingText && (
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={cardData.title}
                    onChange={(e) => updateCardData('title', e.target.value)}
                    placeholder="Full Stack Developer"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    value={cardData.company}
                    onChange={(e) => updateCardData('company', e.target.value)}
                    placeholder="Cosma Tech"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Contact Us - COMPACT */}
          <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => toggleExpanded('contactUs')}
                className="flex items-center gap-3 flex-1"
              >
                <span className="text-base font-semibold text-gray-800">Contact Us</span>
                <FontAwesomeIcon 
                  icon={expandedSection === 'contactUs' ? faChevronUp : faChevronDown} 
                  className="text-gray-600 text-sm"
                />
              </button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sections.contactUs}
                  onChange={() => toggleSection('contactUs')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ffcb66]"></div>
              </label>
            </div>
            {expandedSection === 'contactUs' && sections.contactUs && (
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={cardData.location}
                    onChange={(e) => updateCardData('location', e.target.value)}
                    placeholder="Ho Chi Minh City, Vietnam"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Website
                  </label>
                  <input
                    type="text"
                    value={cardData.website}
                    onChange={(e) => updateCardData('website', e.target.value)}
                    placeholder="www.example.com"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Social Links - COMPACT */}
          <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => toggleExpanded('socialLinks')}
                className="flex items-center gap-3 flex-1"
              >
                <span className="text-base font-semibold text-gray-800">Social Links</span>
                <FontAwesomeIcon 
                  icon={expandedSection === 'socialLinks' ? faChevronUp : faChevronDown} 
                  className="text-gray-600 text-sm"
                />
              </button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sections.socialLinks}
                  onChange={() => toggleSection('socialLinks')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ffcb66]"></div>
              </label>
            </div>
            {expandedSection === 'socialLinks' && sections.socialLinks && (
              <div className="px-4 pb-4 space-y-2.5">
                <input
                  type="url"
                  value={cardData.socials.facebook}
                  onChange={(e) => updateNestedField('socials', 'facebook', e.target.value)}
                  placeholder="https://facebook.com/yourprofile"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm"
                />
                <input
                  type="url"
                  value={cardData.socials.linkedin}
                  onChange={(e) => updateNestedField('socials', 'linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm"
                />
                <input
                  type="url"
                  value={cardData.socials.github}
                  onChange={(e) => updateNestedField('socials', 'github', e.target.value)}
                  placeholder="https://github.com/yourprofile"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm"
                />
                <input
                  type="url"
                  value={cardData.socials.twitter}
                  onChange={(e) => updateNestedField('socials', 'twitter', e.target.value)}
                  placeholder="https://twitter.com/yourprofile"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] focus:ring-2 focus:ring-[#ffcb66]/20 text-sm"
                />
              </div>
            )}
          </div>

        </div>

        {/* Right Panel - COMPACT + HIDDEN SCROLLBAR */}
        <div className="w-1/2 flex flex-col" style={{ backgroundColor: '#004d5c' }}>
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white text-base font-semibold text-center">Live Preview</h3>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto custom-scrollbar">
            <CardPreview cardData={cardData} />
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
    </div>
  );
}