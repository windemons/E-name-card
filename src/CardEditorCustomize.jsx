import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faChevronUp, 
  faImage, 
  faPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import CardPreview from './CardPreview';

export default function CardEditorCustomize({ onBack }) {
  // Card data state - sẽ update real-time
  const [cardData, setCardData] = useState({
    name: 'Your name...',
    title: '',
    company: 'Example Co.',
    phone: '123456789...',
    email: 'hello@mailexample.com',
    location: '123 Anywhere St., Any City, ST 12345',
    website: 'www.reallygreatsite.com',
    avatar: null,
    brandPhoto: null,
    theme: {
      colors: ['#FFFFFF', '#FF6B5B', '#FFE5B4'], // 3 colors like in image
      background: 'linear-gradient(135deg, #003540 0%, #004d5c 100%)'
    },
    socials: {
      facebook: '',
      linkedin: '',
      github: '',
      twitter: ''
    }
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState('customize'); // customize, design, qrcode

  // Sections state (which sections are enabled)
  const [sections, setSections] = useState({
    profile: true,
    headingText: true,
    contactUs: true,
    images: true,
    socialLinks: true
  });

  // Expanded sections state (which accordion is open)
  const [expandedSection, setExpandedSection] = useState(null);

  // Update card data
  const updateCardData = (field, value) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle section enabled/disabled
  const toggleSection = (sectionName) => {
    setSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Toggle section expanded/collapsed
  const toggleExpanded = (sectionName) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };

  // Handle avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCardData('avatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle brand photo upload
  const handleBrandPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCardData('brandPhoto', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle theme color change
  const handleColorChange = (index, color) => {
    const newColors = [...cardData.theme.colors];
    newColors[index] = color;
    
    // Update theme with new gradient
    const newBackground = `linear-gradient(135deg, ${newColors[0]} 0%, ${newColors[1]} 50%, ${newColors[2]} 100%)`;
    
    updateCardData('theme', {
      ...cardData.theme,
      colors: newColors,
      background: newBackground
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#003540' }}>
      {/* Header */}
      <header className="px-8 py-4 flex items-center justify-between border-b border-white/10">
        {/* Logo & Back */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">
            Cosma<span className="text-2xl">🚀</span>
          </h1>
          <button
            onClick={onBack}
            className="px-4 py-2 border-2 border-white text-white rounded-full text-sm font-medium hover:bg-white hover:text-[#003540] transition-all"
          >
            ← Back
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('customize')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'customize'
                ? 'bg-[#ffcb66] text-black'
                : 'bg-transparent text-white border border-white/30 hover:bg-white/10'
            }`}
          >
            Customize
          </button>
          <span className="text-white/50">→</span>
          <button
            onClick={() => setActiveTab('design')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'design'
                ? 'bg-[#ffcb66] text-black'
                : 'bg-transparent text-white border border-white/30 hover:bg-white/10'
            }`}
          >
            Design
          </button>
          <span className="text-white/50">→</span>
          <button
            onClick={() => setActiveTab('qrcode')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'qrcode'
                ? 'bg-[#ffcb66] text-black'
                : 'bg-transparent text-white border border-white/30 hover:bg-white/10'
            }`}
          >
            QRCode
          </button>
        </div>

        {/* Preset Themes */}
        <div className="flex items-center gap-3">
          {/* Quick Theme Presets */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                const colors = ['#667eea', '#764ba2', '#f093fb'];
                updateCardData('theme', {
                  colors: colors,
                  background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`
                });
              }}
              className="w-12 h-12 rounded-xl shadow-lg hover:scale-110 transition-all border-2 border-white/30 hover:border-white/60"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}
              title="Purple Dream"
            />
            <button
              onClick={() => {
                const colors = ['#FF6B6B', '#FFA500', '#FFD700'];
                updateCardData('theme', {
                  colors: colors,
                  background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`
                });
              }}
              className="w-12 h-12 rounded-xl shadow-lg hover:scale-110 transition-all border-2 border-white/30 hover:border-white/60"
              style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FFA500 50%, #FFD700 100%)' }}
              title="Sunset Orange"
            />
            <button
              onClick={() => {
                const colors = ['#00C9FF', '#0084FF', '#667eea'];
                updateCardData('theme', {
                  colors: colors,
                  background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`
                });
              }}
              className="w-12 h-12 rounded-xl shadow-lg hover:scale-110 transition-all border-2 border-white/30 hover:border-white/60"
              style={{ background: 'linear-gradient(135deg, #00C9FF 0%, #0084FF 50%, #667eea 100%)' }}
              title="Ocean Blue"
            />
          </div>
          
          {/* Arrow button */}
          <button className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-all">
            →
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-screen" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Left Panel - Editor */}
        <div className="w-1/2 p-6 space-y-3 overflow-y-auto border-r border-white/10" style={{ backgroundColor: '#003540' }}>
          
          {/* Profile Section */}
          <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
              <button
                onClick={() => toggleExpanded('profile')}
                className="flex items-center gap-3 flex-1"
              >
                <span className="text-lg font-semibold text-gray-800">Profile</span>
                <FontAwesomeIcon 
                  icon={expandedSection === 'profile' ? faChevronUp : faChevronDown} 
                  className="text-gray-600"
                />
              </button>
              
              {/* Toggle Switch */}
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

            {/* Expanded Content */}
            {expandedSection === 'profile' && sections.profile && (
              <div className="px-5 pb-5 space-y-4">
                {/* Photo Uploads */}
                <div className="flex gap-4">
                  {/* Profile Photo */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-white/50 hover:bg-white/70 transition-all">
                      {cardData.avatar ? (
                        <img src={cardData.avatar} alt="Avatar" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <FontAwesomeIcon icon={faImage} className="text-2xl text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500">Upload</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Brand Photo */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand Photo
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-white/50 hover:bg-white/70 transition-all">
                      {cardData.brandPhoto ? (
                        <img src={cardData.brandPhoto} alt="Brand" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <FontAwesomeIcon icon={faImage} className="text-2xl text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500">Upload</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBrandPhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Name Field */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-gray-700">
                      Name
                    </label>
                  </div>
                  <input
                    type="text"
                    value={cardData.name}
                    onChange={(e) => updateCardData('name', e.target.value)}
                    placeholder="your name..."
                    className="w-full px-4 py-3 bg-white/80 rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] transition-all"
                  />
                </div>

                {/* Telephone Field */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-gray-700">
                      Telephone
                    </label>
                  </div>
                  <input
                    type="tel"
                    value={cardData.phone}
                    onChange={(e) => updateCardData('phone', e.target.value)}
                    placeholder="123456789..."
                    className="w-full px-4 py-3 bg-white/80 rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] transition-all"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-gray-700">
                      Email
                    </label>
                  </div>
                  <input
                    type="email"
                    value={cardData.email}
                    onChange={(e) => updateCardData('email', e.target.value)}
                    placeholder="example@..."
                    className="w-full px-4 py-3 bg-white/80 rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66] transition-all"
                  />
                </div>

                {/* Add More Button */}
                <button className="w-full py-3 bg-white rounded-lg border-2 border-dashed border-gray-400 text-gray-700 font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faPlus} />
                  <span>add more +</span>
                </button>
              </div>
            )}
          </div>

          {/* Heading + Text Section */}
          <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <button
                onClick={() => toggleExpanded('headingText')}
                className="flex items-center gap-3 flex-1"
              >
                <span className="text-lg font-semibold text-gray-800">Heading + Text</span>
                <FontAwesomeIcon 
                  icon={expandedSection === 'headingText' ? faChevronUp : faChevronDown} 
                  className="text-gray-600"
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
              <div className="px-5 pb-5 space-y-4">
                <input
                  type="text"
                  value={cardData.title}
                  onChange={(e) => updateCardData('title', e.target.value)}
                  placeholder="Your title..."
                  className="w-full px-4 py-3 bg-white/80 rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66]"
                />
                <input
                  type="text"
                  value={cardData.company}
                  onChange={(e) => updateCardData('company', e.target.value)}
                  placeholder="Company name..."
                  className="w-full px-4 py-3 bg-white/80 rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66]"
                />
              </div>
            )}
          </div>

          {/* Contact Us Section */}
          <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <button
                onClick={() => toggleExpanded('contactUs')}
                className="flex items-center gap-3 flex-1"
              >
                <span className="text-lg font-semibold text-gray-800">Contact Us</span>
                <FontAwesomeIcon 
                  icon={expandedSection === 'contactUs' ? faChevronUp : faChevronDown} 
                  className="text-gray-600"
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
              <div className="px-5 pb-5 space-y-4">
                <input
                  type="text"
                  value={cardData.location}
                  onChange={(e) => updateCardData('location', e.target.value)}
                  placeholder="Location..."
                  className="w-full px-4 py-3 bg-white/80 rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66]"
                />
                <input
                  type="text"
                  value={cardData.website}
                  onChange={(e) => updateCardData('website', e.target.value)}
                  placeholder="Website..."
                  className="w-full px-4 py-3 bg-white/80 rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66]"
                />
              </div>
            )}
          </div>

          {/* Images Section */}
          <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <button
                onClick={() => toggleExpanded('images')}
                className="flex items-center gap-3 flex-1"
              >
                <span className="text-lg font-semibold text-gray-800">Images</span>
                <FontAwesomeIcon 
                  icon={expandedSection === 'images' ? faChevronUp : faChevronDown} 
                  className="text-gray-600"
                />
              </button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sections.images}
                  onChange={() => toggleSection('images')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ffcb66]"></div>
              </label>
            </div>
            {expandedSection === 'images' && sections.images && (
              <div className="px-5 pb-5">
                <p className="text-gray-600 text-sm">Upload gallery images (Coming soon)</p>
              </div>
            )}
          </div>

          {/* Social Links Section */}
          <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <button
                onClick={() => toggleExpanded('socialLinks')}
                className="flex items-center gap-3 flex-1"
              >
                <span className="text-lg font-semibold text-gray-800">Social Links</span>
                <FontAwesomeIcon 
                  icon={expandedSection === 'socialLinks' ? faChevronUp : faChevronDown} 
                  className="text-gray-600"
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
              <div className="px-5 pb-5 space-y-3">
                <input
                  type="url"
                  value={cardData.socials.facebook}
                  onChange={(e) => updateCardData('socials', { ...cardData.socials, facebook: e.target.value })}
                  placeholder="Facebook URL..."
                  className="w-full px-4 py-3 bg-white/80 rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66]"
                />
                <input
                  type="url"
                  value={cardData.socials.linkedin}
                  onChange={(e) => updateCardData('socials', { ...cardData.socials, linkedin: e.target.value })}
                  placeholder="LinkedIn URL..."
                  className="w-full px-4 py-3 bg-white/80 rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66]"
                />
                <input
                  type="url"
                  value={cardData.socials.github}
                  onChange={(e) => updateCardData('socials', { ...cardData.socials, github: e.target.value })}
                  placeholder="GitHub URL..."
                  className="w-full px-4 py-3 bg-white/80 rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66]"
                />
                <input
                  type="url"
                  value={cardData.socials.twitter}
                  onChange={(e) => updateCardData('socials', { ...cardData.socials, twitter: e.target.value })}
                  placeholder="Twitter URL..."
                  className="w-full px-4 py-3 bg-white/80 rounded-lg border border-gray-300 focus:outline-none focus:border-[#ffcb66]"
                />
              </div>
            )}
          </div>

        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-1/2 flex flex-col" style={{ backgroundColor: '#004d5c', minHeight: 'calc(100vh - 80px)' }}>
          {/* Preview Title */}
          <div className="p-6 border-b border-white/10">
            <h3 className="text-white text-lg font-semibold text-center">Live Preview</h3>
          </div>
          
          {/* Preview Content - Centered */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
            <div className="w-full max-w-2xl">
              <CardPreview cardData={cardData} />
            </div>
          </div>
          
          {/* Save Button - Fixed at bottom */}
          <div className="p-6 border-t border-white/10 flex justify-center">
            <button className="px-10 py-3 bg-[#ffcb66] text-black rounded-lg font-semibold hover:scale-105 transition-all shadow-lg">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}