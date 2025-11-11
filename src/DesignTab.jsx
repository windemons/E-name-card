import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faChevronUp,
  faCheck,
  faRocket,
  faStar,
  faHeart,
  faBolt,
  faCrown,
  faFire,
  faDiamond,
  faTrophy,
  faGem,
  faMedal
} from '@fortawesome/free-solid-svg-icons';

// Available stickers
const STICKERS = [
  { id: 'rocket', icon: faRocket, label: '🚀 Rocket' },
  { id: 'star', icon: faStar, label: '⭐ Star' },
  { id: 'heart', icon: faHeart, label: '❤️ Heart' },
  { id: 'bolt', icon: faBolt, label: '⚡ Bolt' },
  { id: 'crown', icon: faCrown, label: '👑 Crown' },
  { id: 'fire', icon: faFire, label: '🔥 Fire' },
  { id: 'diamond', icon: faDiamond, label: '💎 Diamond' },
  { id: 'trophy', icon: faTrophy, label: '🏆 Trophy' },
  { id: 'gem', icon: faGem, label: '💍 Gem' },
  { id: 'medal', icon: faMedal, label: '🥇 Medal' }
];

// Color themes
const COLOR_THEMES = [
  { id: 'default', name: 'Teal Classic', primary: '#00343d', accent: '#3b82f6' },
  { id: 'blue', name: 'Ocean Blue', primary: '#1e3a8a', accent: '#3b82f6' },
  { id: 'purple', name: 'Royal Purple', primary: '#581c87', accent: '#a855f7' },
  { id: 'green', name: 'Forest Green', primary: '#14532d', accent: '#22c55e' },
  { id: 'red', name: 'Ruby Red', primary: '#7f1d1d', accent: '#ef4444' },
  { id: 'orange', name: 'Sunset Orange', primary: '#7c2d12', accent: '#f97316' },
  { id: 'pink', name: 'Rose Pink', primary: '#831843', accent: '#ec4899' },
  { id: 'indigo', name: 'Deep Indigo', primary: '#312e81', accent: '#6366f1' }
];

// Font styles
const FONT_STYLES = [
  { id: 'default', name: 'Default', family: 'system-ui, -apple-system, sans-serif' },
  { id: 'roboto', name: 'Roboto', family: "'Roboto', sans-serif" },
  { id: 'opensans', name: 'Open Sans', family: "'Open Sans', sans-serif" },
  { id: 'montserrat', name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', serif" },
  { id: 'lato', name: 'Lato', family: "'Lato', sans-serif" },
  { id: 'raleway', name: 'Raleway', family: "'Raleway', sans-serif" },
  { id: 'poppins', name: 'Poppins', family: "'Poppins', sans-serif" },
  { id: 'inter', name: 'Inter', family: "'Inter', sans-serif" },
  { id: 'nunito', name: 'Nunito', family: "'Nunito', sans-serif" }
];

export default function DesignTab({ cardData, updateCardData }) {
  const [expandedSection, setExpandedSection] = useState('stickers');

  const toggleExpanded = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleStickerSelect = (stickerId) => {
    updateCardData('sticker', stickerId);
  };

  const handleColorSelect = (colorTheme) => {
    updateCardData('colorTheme', colorTheme);
  };

  const handleFontSelect = (fontStyle) => {
    updateCardData('fontStyle', fontStyle);
  };

  return (
    <div className="space-y-2.5">
      
      {/* Stickers Section */}
      <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-xl overflow-hidden">
        <button
          onClick={() => toggleExpanded('stickers')}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/20 transition-all"
        >
          <span className="text-base font-semibold text-gray-800">Stickers</span>
          <FontAwesomeIcon 
            icon={expandedSection === 'stickers' ? faChevronUp : faChevronDown} 
            className="text-gray-600 text-sm"
          />
        </button>

        {expandedSection === 'stickers' && (
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-600 mb-3">Add a decorative sticker to your card</p>
            <div className="grid grid-cols-5 gap-2">
              {STICKERS.map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => handleStickerSelect(sticker.id)}
                  className={`relative aspect-square rounded-lg border-2 transition-all flex items-center justify-center hover:scale-105 ${
                    cardData.sticker === sticker.id
                      ? 'border-[#ffcb66] bg-[#ffcb66]/20'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  title={sticker.label}
                >
                  <FontAwesomeIcon 
                    icon={sticker.icon} 
                    className={`text-2xl ${
                      cardData.sticker === sticker.id ? 'text-[#00343d]' : 'text-gray-600'
                    }`}
                  />
                  {cardData.sticker === sticker.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ffcb66] rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faCheck} className="text-xs text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {cardData.sticker && (
              <button
                onClick={() => handleStickerSelect(null)}
                className="mt-3 w-full text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Remove Sticker
              </button>
            )}
          </div>
        )}
      </div>

      {/* Color Theme Section */}
      <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-xl overflow-hidden">
        <button
          onClick={() => toggleExpanded('color')}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/20 transition-all"
        >
          <span className="text-base font-semibold text-gray-800">Color Theme</span>
          <FontAwesomeIcon 
            icon={expandedSection === 'color' ? faChevronUp : faChevronDown} 
            className="text-gray-600 text-sm"
          />
        </button>

        {expandedSection === 'color' && (
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-600 mb-3">Change card colors</p>
            <div className="grid grid-cols-2 gap-2">
              {COLOR_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleColorSelect(theme)}
                  className={`relative rounded-lg border-2 transition-all p-3 hover:scale-105 ${
                    cardData.colorTheme?.id === theme.id
                      ? 'border-[#ffcb66] bg-[#ffcb66]/10'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: theme.accent }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 block text-left">
                    {theme.name}
                  </span>
                  {cardData.colorTheme?.id === theme.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#ffcb66] rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faCheck} className="text-xs text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Font Style Section */}
      <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-xl overflow-hidden">
        <button
          onClick={() => toggleExpanded('font')}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/20 transition-all"
        >
          <span className="text-base font-semibold text-gray-800">Font Style</span>
          <FontAwesomeIcon 
            icon={expandedSection === 'font' ? faChevronUp : faChevronDown} 
            className="text-gray-600 text-sm"
          />
        </button>

        {expandedSection === 'font' && (
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-600 mb-3">Choose typography style</p>
            <div className="space-y-2">
              {FONT_STYLES.map((font) => (
                <button
                  key={font.id}
                  onClick={() => handleFontSelect(font)}
                  className={`relative w-full rounded-lg border-2 transition-all p-3 text-left hover:scale-[1.02] ${
                    cardData.fontStyle?.id === font.id
                      ? 'border-[#ffcb66] bg-[#ffcb66]/10'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span 
                        className="text-base font-medium text-gray-800 block"
                        style={{ fontFamily: font.family }}
                      >
                        {font.name}
                      </span>
                      <span 
                        className="text-xs text-gray-600"
                        style={{ fontFamily: font.family }}
                      >
                        The quick brown fox jumps
                      </span>
                    </div>
                    {cardData.fontStyle?.id === font.id && (
                      <div className="w-6 h-6 bg-[#ffcb66] rounded-full flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faCheck} className="text-xs text-black" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}