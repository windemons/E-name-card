import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faChevronUp,
  faCheck,
  faImage,
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

// QR Frame Shapes - Frames that surround the QR code
const QR_FRAME_SHAPES = [
  { id: 'none', name: 'None', preview: '⬜', desc: 'No frame' },
  { id: 'circle', name: 'Circle', preview: '⭕', desc: 'Round frame' },
  { id: 'diamond', name: 'Diamond', preview: '💎', desc: 'Diamond shape' },
  { id: 'hexagon', name: 'Hexagon', preview: '⬡', desc: 'Hexagon frame' },
  { id: 'star', name: 'Star', preview: '⭐', desc: 'Star shape' },
  { id: 'pentagon', name: 'Pentagon', preview: '⬟', desc: 'Pentagon frame' },
  { id: 'square-rounded', name: 'Rounded Square', preview: '⬜', desc: 'Rounded corners' },
  { id: 'badge', name: 'Badge', preview: '🏷️', desc: 'Badge style' },
  { id: 'octagon', name: 'Octagon', preview: '🛑', desc: 'Octagon shape' },
  { id: 'shield', name: 'Shield', preview: '🛡️', desc: 'Shield frame' }
];

// QR Decorative Stickers - Decorative borders/frames around the shape
const QR_STICKERS = [
  { id: 'none', name: 'None', preview: '⬜', desc: 'No sticker' },
  { id: 'christmas-wreath', name: 'Christmas Wreath', preview: '🎄', desc: 'Holiday wreath' },
  { id: 'flower-border', name: 'Flower Border', preview: '🌺', desc: 'Floral decoration' },
  { id: 'vintage-frame', name: 'Vintage Frame', preview: '🖼️', desc: 'Classic frame' },
  { id: 'ribbon-badge', name: 'Ribbon Badge', preview: '🎀', desc: 'Ribbon decoration' },
  { id: 'laurel-wreath', name: 'Laurel Wreath', preview: '🏆', desc: 'Achievement style' },
  { id: 'sunburst', name: 'Sunburst', preview: '☀️', desc: 'Rays pattern' },
  { id: 'dotted-border', name: 'Dotted Border', preview: '⚫', desc: 'Dotted frame' },
  { id: 'scallop-edge', name: 'Scallop Edge', preview: '🌊', desc: 'Wavy border' },
  { id: 'geometric', name: 'Geometric', preview: '◆', desc: 'Modern pattern' }
];

// Center Logo Icons - Icons to place in center of QR
const CENTER_LOGO_ICONS = [
  { id: 'rocket', icon: faRocket, label: 'Rocket', emoji: '🚀' },
  { id: 'star', icon: faStar, label: 'Star', emoji: '⭐' },
  { id: 'heart', icon: faHeart, label: 'Heart', emoji: '❤️' },
  { id: 'bolt', icon: faBolt, label: 'Bolt', emoji: '⚡' },
  { id: 'crown', icon: faCrown, label: 'Crown', emoji: '👑' },
  { id: 'fire', icon: faFire, label: 'Fire', emoji: '🔥' },
  { id: 'diamond', icon: faDiamond, label: 'Diamond', emoji: '💎' },
  { id: 'trophy', icon: faTrophy, label: 'Trophy', emoji: '🏆' },
  { id: 'gem', icon: faGem, label: 'Gem', emoji: '💍' },
  { id: 'medal', icon: faMedal, label: 'Medal', emoji: '🥇' }
];

export default function QRTab({ cardData, updateCardData }) {
  const [expandedSection, setExpandedSection] = useState('qrShape');

  const toggleExpanded = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleQRShapeSelect = (shapeId) => {
    updateCardData('qrShape', shapeId);
  };

  const handleQRStickerSelect = (stickerId) => {
    updateCardData('qrSticker', stickerId);
  };

  const handleCenterLogoIconSelect = (iconId) => {
    // Clear custom logo when selecting icon
    updateCardData('qrLogo', null);
    updateCardData('qrCenterIcon', iconId);
  };

  const handleQRLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File must be less than 2MB for QR logo');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        // Clear icon when uploading custom logo
        updateCardData('qrCenterIcon', null);
        updateCardData('qrLogo', reader.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-2.5">
      
      {/* QR Frame Shape Section */}
      <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-xl overflow-hidden">
        <button
          onClick={() => toggleExpanded('qrShape')}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/20 transition-all"
        >
          <span className="text-base font-semibold text-gray-800">QR Frame Shape</span>
          <FontAwesomeIcon 
            icon={expandedSection === 'qrShape' ? faChevronUp : faChevronDown} 
            className="text-gray-600 text-sm"
          />
        </button>

        {expandedSection === 'qrShape' && (
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-600 mb-3">Choose frame that surrounds your QR code</p>
            <div className="grid grid-cols-5 gap-2">
              {QR_FRAME_SHAPES.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => handleQRShapeSelect(shape.id)}
                  className={`relative aspect-square rounded-lg border-2 transition-all flex flex-col items-center justify-center hover:scale-105 p-2 ${
                    cardData.qrShape === shape.id
                      ? 'border-[#ffcb66] bg-[#ffcb66]/20'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  title={shape.desc}
                >
                  <span className="text-2xl mb-1">{shape.preview}</span>
                  <span className={`text-[9px] font-medium text-center leading-tight ${
                    cardData.qrShape === shape.id ? 'text-[#00343d]' : 'text-gray-600'
                  }`}>
                    {shape.name}
                  </span>
                  {cardData.qrShape === shape.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ffcb66] rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faCheck} className="text-xs text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QR Decorative Sticker Section */}
      <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-xl overflow-hidden">
        <button
          onClick={() => toggleExpanded('qrSticker')}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/20 transition-all"
        >
          <span className="text-base font-semibold text-gray-800">QR Decorative Border</span>
          <FontAwesomeIcon 
            icon={expandedSection === 'qrSticker' ? faChevronUp : faChevronDown} 
            className="text-gray-600 text-sm"
          />
        </button>

        {expandedSection === 'qrSticker' && (
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-600 mb-3">Add decorative border around the frame</p>
            <div className="grid grid-cols-5 gap-2">
              {QR_STICKERS.map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => handleQRStickerSelect(sticker.id)}
                  className={`relative aspect-square rounded-lg border-2 transition-all flex flex-col items-center justify-center hover:scale-105 p-2 ${
                    cardData.qrSticker === sticker.id
                      ? 'border-[#ffcb66] bg-[#ffcb66]/20'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  title={sticker.desc}
                >
                  <span className="text-2xl mb-1">{sticker.preview}</span>
                  <span className={`text-[9px] font-medium text-center leading-tight ${
                    cardData.qrSticker === sticker.id ? 'text-[#00343d]' : 'text-gray-600'
                  }`}>
                    {sticker.name}
                  </span>
                  {cardData.qrSticker === sticker.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ffcb66] rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faCheck} className="text-xs text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QR Center Logo Section */}
      <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E4F7] rounded-xl overflow-hidden">
        <button
          onClick={() => toggleExpanded('qrLogo')}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/20 transition-all"
        >
          <span className="text-base font-semibold text-gray-800">QR Center Logo</span>
          <FontAwesomeIcon 
            icon={expandedSection === 'qrLogo' ? faChevronUp : faChevronDown} 
            className="text-gray-600 text-sm"
          />
        </button>

        {expandedSection === 'qrLogo' && (
          <div className="px-4 pb-4 space-y-4">
            
            {/* Icon Selection */}
            <div>
              <p className="text-xs text-gray-600 mb-3">Choose icon for QR center</p>
              <div className="grid grid-cols-5 gap-2">
                {CENTER_LOGO_ICONS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleCenterLogoIconSelect(item.id)}
                    className={`relative aspect-square rounded-lg border-2 transition-all flex items-center justify-center hover:scale-105 ${
                      cardData.qrCenterIcon === item.id
                        ? 'border-[#ffcb66] bg-[#ffcb66]/20'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    title={item.label}
                  >
                    <FontAwesomeIcon 
                      icon={item.icon} 
                      className={`text-2xl ${
                        cardData.qrCenterIcon === item.id ? 'text-[#00343d]' : 'text-gray-600'
                      }`}
                    />
                    {cardData.qrCenterIcon === item.id && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ffcb66] rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faCheck} className="text-xs text-black" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {cardData.qrCenterIcon && (
                <button
                  onClick={() => handleCenterLogoIconSelect(null)}
                  className="mt-3 w-full text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Remove Icon
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs font-semibold text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Custom Logo Upload */}
            <div>
              <p className="text-xs text-gray-600 mb-3">Upload custom logo (max 2MB)</p>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-white/50 hover:bg-white/70 transition-all overflow-hidden group">
                {cardData.qrLogo ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={cardData.qrLogo} 
                      alt="QR Logo" 
                      className="w-full h-full object-contain p-3" 
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Click to change</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <FontAwesomeIcon icon={faImage} className="text-3xl text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 font-medium">Click to upload logo</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG (max 2MB)</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleQRLogoUpload} 
                  className="hidden" 
                />
              </label>

              {cardData.qrLogo && (
                <button
                  onClick={() => updateCardData('qrLogo', null)}
                  className="mt-3 w-full text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Remove Custom Logo
                </button>
              )}
            </div>

            {/* Info Box */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-gray-700">
                <span className="font-semibold">💡 Tip:</span> Logo will be placed in center of QR code. 
                {cardData.qrCenterIcon && !cardData.qrLogo && ' Icon selected.'}
                {cardData.qrLogo && ' Custom logo selected.'}
                {!cardData.qrCenterIcon && !cardData.qrLogo && ' No center decoration.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">Important:</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              QR customization affects <span className="font-bold">scannability</span>. 
              Complex decorations and large center elements may reduce scan success. 
              Always test your QR code before printing or sharing.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}