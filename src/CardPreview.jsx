import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faGlobe,
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
import { 
  faFacebookF, 
  faLinkedinIn, 
  faGithub,
  faTwitter 
} from '@fortawesome/free-brands-svg-icons';

// Sticker mapping
const STICKER_ICONS = {
  rocket: faRocket,
  star: faStar,
  heart: faHeart,
  bolt: faBolt,
  crown: faCrown,
  fire: faFire,
  diamond: faDiamond,
  trophy: faTrophy,
  gem: faGem,
  medal: faMedal
};

// Sticker Display Component
function StickerDisplay({ stickerId, colorTheme }) {
  if (!stickerId || !STICKER_ICONS[stickerId]) return null;
  
  return (
    <div 
      className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
      style={{ backgroundColor: colorTheme?.primary || '#00343d' }}
    >
      <FontAwesomeIcon 
        icon={STICKER_ICONS[stickerId]} 
        className="text-lg"
        style={{ color: '#ffcb66' }}
      />
    </div>
  );
}

export default function CardPreview({ cardData }) {
  const [data, setData] = useState({
    name: 'Your Name',
    title: 'Your Title',
    company: 'Your Company',
    email: 'email@example.com',
    phone: '+84 123 456 789',
    location: 'Ho Chi Minh City, Vietnam',
    website: 'www.example.com',
    avatar: null,
    brandPhoto: null,
    theme: 'classic',
    sticker: null,
    colorTheme: { id: 'default', primary: '#00343d', accent: '#3b82f6' },
    fontStyle: { id: 'default', family: 'system-ui, -apple-system, sans-serif' },
    socials: {
      facebook: '',
      linkedin: '',
      github: '',
      twitter: ''
    }
  });

  useEffect(() => {
    if (cardData) {
      setData(cardData);
    } else {
      const saved = localStorage.getItem('cosma_card_data');
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          setData(parsedData);
        } catch (e) {
          console.error('Failed to load card data');
        }
      }
    }
  }, [cardData]);

  // Render theme based on selection
  const renderTheme = () => {
    switch (data.theme) {
      case 'arrow':
        return <ArrowTheme data={data} />;
      case 'shield':
        return <ShieldTheme data={data} />;
      case 'wave':
        return <WaveTheme data={data} />;
      case 'classic':
      default:
        return <ClassicTheme data={data} />;
    }
  };

  return (
    <div className="relative w-full">
      {renderTheme()}
    </div>
  );
}

// ============================================
// THEME 1: CLASSIC (Simple two-half design)
// ============================================
function ClassicTheme({ data }) {
  const primaryColor = data.colorTheme?.primary || '#00343d';
  const accentColor = data.colorTheme?.accent || '#3b82f6';
  const fontFamily = data.fontStyle?.family || 'system-ui, -apple-system, sans-serif';

  return (
    <div 
      className="w-full max-w-[720px] mx-auto rounded-2xl shadow-2xl overflow-hidden relative flex"
      style={{
        height: '400px',
        backgroundColor: '#fff',
        fontFamily: fontFamily
      }}
    >
      {/* Sticker */}
      <StickerDisplay stickerId={data.sticker} colorTheme={data.colorTheme} />

      {/* LEFT - Dark Teal */}
      <div 
        className="w-[45%] p-8 flex flex-col items-center justify-center text-white relative"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="mb-6">
          <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg bg-white/10">
            {data.avatar ? (
              <img src={data.avatar} alt={data.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-br from-white/20 to-white/5">
                {data.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 leading-tight">{data.name || 'Your Name'}</h2>
          {data.title && <p className="text-sm opacity-90 mb-1 font-medium">{data.title}</p>}
          {data.company && <p className="text-xs opacity-75 mt-2">{data.company}</p>}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* RIGHT - White */}
      <div className="flex-1 bg-white relative p-8 flex flex-col justify-between">
        {data.brandPhoto && (
          <div className="absolute top-6 right-6 z-10">
            <img src={data.brandPhoto} alt="Brand Logo" className="w-20 h-20 object-contain" />
          </div>
        )}

        <div className="pr-20">
          {data.company && (
            <div className="mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Group</span>
              <div className="mt-1">
                <span className="text-xl font-bold text-gray-900">{data.company}</span>
              </div>
            </div>
          )}
          {data.title && (
            <div className="mb-4">
              <span className="text-sm text-gray-600 font-medium">{data.title}</span>
            </div>
          )}
        </div>

        <div className="space-y-2.5 flex-1">
          {data.email && (
            <div className="text-sm text-gray-700 flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-xs" />
              <span>{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="text-sm text-gray-700 flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="text-gray-400 text-xs" />
              <span>{data.phone}</span>
            </div>
          )}
          {data.location && (
            <div className="text-sm text-gray-700 flex items-center gap-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 text-xs" />
              <span>{data.location}</span>
            </div>
          )}
          {data.website && (
            <div className="text-sm text-blue-600 font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faGlobe} className="text-blue-500 text-xs" />
              <span>{data.website}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          {data.socials?.facebook && (
            <a href={data.socials.facebook} target="_blank" rel="noopener noreferrer" 
               className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
               style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
              <FontAwesomeIcon icon={faFacebookF} className="text-sm" />
            </a>
          )}
          {data.socials?.linkedin && (
            <a href={data.socials.linkedin} target="_blank" rel="noopener noreferrer"
               className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
               style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
              <FontAwesomeIcon icon={faLinkedinIn} className="text-sm" />
            </a>
          )}
          {data.socials?.github && (
            <a href={data.socials.github} target="_blank" rel="noopener noreferrer"
               className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
               style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
              <FontAwesomeIcon icon={faGithub} className="text-sm" />
            </a>
          )}
          {data.socials?.twitter && (
            <a href={data.socials.twitter} target="_blank" rel="noopener noreferrer"
               className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
               style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
              <FontAwesomeIcon icon={faTwitter} className="text-sm" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// THEME 2: ARROW (Sharp chevron pointing right)
// ============================================
function ArrowTheme({ data }) {
  const primaryColor = data.colorTheme?.primary || '#00343d';
  const accentColor = data.colorTheme?.accent || '#3b82f6';
  const fontFamily = data.fontStyle?.family || 'system-ui, -apple-system, sans-serif';

  return (
    <div 
      className="w-full max-w-[720px] mx-auto rounded-2xl shadow-2xl relative"
      style={{ height: '400px', fontFamily: fontFamily }}
    >
      <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden">
        {/* Sticker */}
        <StickerDisplay stickerId={data.sticker} colorTheme={data.colorTheme} />

        {/* LEFT - Arrow Shape with clip-path */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-[45%] flex flex-col items-center justify-center text-white p-8"
          style={{ 
            backgroundColor: primaryColor,
            clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)'
          }}
        >
          <div className="mb-6 mr-12">
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg border-4 border-white/20">
              {data.avatar ? (
                <img src={data.avatar} alt={data.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-white/10">
                  {data.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>
          </div>

          <div className="text-center mr-12">
            <h2 className="text-xl font-bold mb-1 leading-tight">{data.name || 'Your Name'}</h2>
            {data.title && <p className="text-xs opacity-90">{data.title}</p>}
          </div>
        </div>

        {/* RIGHT - Content (shifted right to avoid arrow overlap) */}
        <div className="absolute right-0 top-0 bottom-0 w-[58%] pl-12 pr-8 py-8 flex flex-col justify-between">
          {data.brandPhoto && (
            <div className="flex justify-end">
              <img src={data.brandPhoto} alt="Brand" className="w-20 h-20 object-contain" />
            </div>
          )}

          <div>
            {data.company && (
              <div className="mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Group</span>
                <div className="text-xl font-bold text-gray-900 mt-1">{data.company}</div>
              </div>
            )}
          </div>

          <div className="space-y-2.5 text-sm">
            {data.email && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-xs w-4" />
                <span className="text-gray-700">{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="text-gray-400 text-xs w-4" />
                <span className="text-gray-700">{data.phone}</span>
              </div>
            )}
            {data.location && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 text-xs w-4" />
                <span className="text-gray-700">{data.location}</span>
              </div>
            )}
            {data.website && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faGlobe} className="text-blue-500 text-xs w-4" />
                <span className="text-blue-600">{data.website}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            {data.socials?.facebook && (
              <a href={data.socials.facebook} target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                 style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                <FontAwesomeIcon icon={faFacebookF} className="text-sm" />
              </a>
            )}
            {data.socials?.linkedin && (
              <a href={data.socials.linkedin} target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                 style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                <FontAwesomeIcon icon={faLinkedinIn} className="text-sm" />
              </a>
            )}
            {data.socials?.github && (
              <a href={data.socials.github} target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                 style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                <FontAwesomeIcon icon={faGithub} className="text-sm" />
              </a>
            )}
            {data.socials?.twitter && (
              <a href={data.socials.twitter} target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                 style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                <FontAwesomeIcon icon={faTwitter} className="text-sm" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// THEME 3: SHIELD (Shield banner on left with pointed bottom)
// ============================================
function ShieldTheme({ data }) {
  const primaryColor = data.colorTheme?.primary || '#00343d';
  const accentColor = data.colorTheme?.accent || '#3b82f6';
  const fontFamily = data.fontStyle?.family || 'system-ui, -apple-system, sans-serif';

  return (
    <div 
      className="w-full max-w-[720px] mx-auto rounded-2xl shadow-2xl relative"
      style={{ height: '400px', fontFamily: fontFamily }}
    >
      <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden">
        {/* Sticker */}
        <StickerDisplay stickerId={data.sticker} colorTheme={data.colorTheme} />

        {/* LEFT - Shield Banner Shape */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-[40%] flex flex-col items-center justify-center text-white p-6"
          style={{ 
            backgroundColor: primaryColor,
            clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)'
          }}
        >
          <div className="mb-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden shadow-xl border-3 border-white/30">
              {data.avatar ? (
                <img src={data.avatar} alt={data.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-white/10">
                  {data.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold mb-1 leading-tight">{data.name || 'Your Name'}</h2>
            {data.title && <p className="text-xs opacity-90 font-medium">{data.title}</p>}
            {data.company && <p className="text-[10px] opacity-75 mt-1">{data.company}</p>}
          </div>
        </div>

        {/* RIGHT - Content */}
        <div className="absolute right-0 top-0 bottom-0 w-[62%] p-8 flex flex-col justify-between">
          {data.brandPhoto && (
            <div className="flex justify-end">
              <img src={data.brandPhoto} alt="Brand" className="w-16 h-16 object-contain" />
            </div>
          )}

          <div>
            {data.company && (
              <div className="mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Group</span>
                <div className="text-lg font-bold text-gray-900 mt-1">{data.company}</div>
              </div>
            )}
            {data.title && (
              <div className="mb-2">
                <span className="text-sm text-gray-600 font-medium">{data.title}</span>
              </div>
            )}
          </div>

          <div className="space-y-2 flex-1">
            {data.email && (
              <div className="text-sm text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-xs" />
                <span>{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="text-sm text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="text-gray-400 text-xs" />
                <span>{data.phone}</span>
              </div>
            )}
            {data.location && (
              <div className="text-sm text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 text-xs" />
                <span>{data.location}</span>
              </div>
            )}
            {data.website && (
              <div className="text-sm text-blue-600 font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faGlobe} className="text-blue-500 text-xs" />
                <span>{data.website}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 pt-3 border-t border-gray-200">
            {data.socials?.facebook && (
              <a href={data.socials.facebook} target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                 style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                <FontAwesomeIcon icon={faFacebookF} className="text-xs" />
              </a>
            )}
            {data.socials?.linkedin && (
              <a href={data.socials.linkedin} target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                 style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                <FontAwesomeIcon icon={faLinkedinIn} className="text-xs" />
              </a>
            )}
            {data.socials?.github && (
              <a href={data.socials.github} target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                 style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                <FontAwesomeIcon icon={faGithub} className="text-xs" />
              </a>
            )}
            {data.socials?.twitter && (
              <a href={data.socials.twitter} target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                 style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                <FontAwesomeIcon icon={faTwitter} className="text-xs" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// THEME 4: WAVE (Organic wavy shape on left)
// ============================================
function WaveTheme({ data }) {
  const primaryColor = data.colorTheme?.primary || '#00343d';
  const accentColor = data.colorTheme?.accent || '#3b82f6';
  const fontFamily = data.fontStyle?.family || 'system-ui, -apple-system, sans-serif';

  return (
    <div 
      className="w-full max-w-[720px] mx-auto rounded-2xl shadow-2xl relative"
      style={{ height: '400px', fontFamily: fontFamily }}
    >
      <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden">
        {/* Sticker */}
        <StickerDisplay stickerId={data.sticker} colorTheme={data.colorTheme} />

        {/* LEFT - Organic Wave Shape */}
        <div className="absolute left-0 top-0 bottom-0 w-[50%]">
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 400 400" 
            preserveAspectRatio="none"
          >
            <path 
              d="M 0 0 L 320 0 Q 380 100 360 200 Q 340 300 380 400 L 0 400 Z" 
              fill={primaryColor}
            />
          </svg>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-8">
            <div className="mb-5 mr-8">
              <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl border-4 border-white/20">
                {data.avatar ? (
                  <img src={data.avatar} alt={data.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-white/10">
                    {data.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mr-8">
              <h2 className="text-2xl font-bold mb-2 leading-tight">{data.name || 'Your Name'}</h2>
              {data.title && <p className="text-sm opacity-90">{data.title}</p>}
              {data.company && <p className="text-xs opacity-75 mt-2">{data.company}</p>}
            </div>
          </div>
        </div>

        {/* RIGHT - Content */}
        <div className="absolute right-0 top-0 bottom-0 w-[55%] p-8 flex flex-col justify-between">
          {data.brandPhoto && (
            <div className="flex justify-end">
              <img src={data.brandPhoto} alt="Brand" className="w-20 h-20 object-contain" />
            </div>
          )}

          <div>
            {data.company && (
              <div className="mb-4">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Group</span>
                <div className="text-xl font-bold text-gray-900 mt-1">{data.company}</div>
              </div>
            )}
          </div>

          <div className="space-y-2.5 text-sm">
            {data.email && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-xs" />
                <span className="text-gray-700">{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="text-gray-400 text-xs" />
                <span className="text-gray-700">{data.phone}</span>
              </div>
            )}
            {data.location && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 text-xs" />
                <span className="text-gray-700">{data.location}</span>
              </div>
            )}
            {data.website && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faGlobe} className="text-blue-500 text-xs" />
                <span className="text-blue-600 font-medium">{data.website}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            {data.socials?.facebook && (
              <a href={data.socials.facebook} target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                 style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                <FontAwesomeIcon icon={faFacebookF} className="text-sm" />
              </a>
            )}
            {data.socials?.linkedin && (
              <a href={data.socials.linkedin} target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                 style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                <FontAwesomeIcon icon={faLinkedinIn} className="text-sm" />
              </a>
            )}
            {data.socials?.github && (
              <a href={data.socials.github} target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                 style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                <FontAwesomeIcon icon={faGithub} className="text-sm" />
              </a>
            )}
            {data.socials?.twitter && (
              <a href={data.socials.twitter} target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                 style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                <FontAwesomeIcon icon={faTwitter} className="text-sm" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}