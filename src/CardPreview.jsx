import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, 
  faLinkedinIn, 
  faGithub,
  faTwitter 
} from '@fortawesome/free-brands-svg-icons';

export default function CardPreview({ cardData }) {
  // State để lưu data (từ props hoặc localStorage)
  const [data, setData] = useState({
    name: 'Your Name',
    title: 'Your Title',
    company: 'Your Company',
    email: 'email@example.com',
    phone: '+84 123 456 789',
    location: 'Location',
    website: 'www.example.com',
    avatar: null,
    brandPhoto: null,
    theme: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
    },
    socials: {
      facebook: '',
      linkedin: '',
      github: '',
      twitter: ''
    }
  });

  // ✅ useEffect để đọc từ localStorage hoặc dùng props
  useEffect(() => {
    if (cardData) {
      // Nếu có props, dùng props (ưu tiên)
      setData(cardData);
    } else {
      // Nếu không có props, đọc từ localStorage
      const saved = localStorage.getItem('cosma_card_data');
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          setData(parsedData);
          console.log('✅ Loaded card data from localStorage:', parsedData);
        } catch (e) {
          console.error('❌ Failed to load card data from localStorage:', e);
        }
      }
    }
  }, [cardData]);

  return (
    <div className="relative w-full">
      {/* Card - FIXED SIZE */}
      <div 
        className="w-full max-w-[700px] mx-auto rounded-2xl shadow-2xl overflow-hidden relative"
        style={{
          height: '380px', // FIXED HEIGHT
          background: data.theme?.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
        }}
      >
        {/* Brand Logo - Top Right */}
        {data.brandPhoto && (
          <div className="absolute top-4 right-4 z-10">
            <div className="w-16 h-16 rounded-lg bg-white/90 p-2 shadow-lg">
              <img 
                src={data.brandPhoto} 
                alt="Brand Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Decorative blurs */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-8 right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-8 left-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-row text-white">
          {/* Left - Profile */}
          <div className="w-2/5 flex flex-col items-center justify-center p-6 border-r border-white/20">
            {/* Avatar */}
            <div className="mb-3">
              <div className="w-28 h-28 rounded-full border-4 border-white/30 overflow-hidden shadow-xl bg-white/20">
                {data.avatar ? (
                  <img 
                    src={data.avatar} 
                    alt={data.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
                    {data.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
            </div>

            {/* Name & Info */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{data.name || 'Your Name'}</h2>
              {data.title && <p className="text-base opacity-90 mb-1">{data.title}</p>}
              {data.company && <p className="text-sm opacity-75">{data.company}</p>}
            </div>
          </div>

          {/* Right - Contact */}
          <div className="flex-1 flex flex-col justify-center p-8">
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              {data.email && (
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faEnvelope} className="w-5 text-white/80 flex-shrink-0" />
                  <span className="text-sm truncate">{data.email}</span>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faPhone} className="w-5 text-white/80 flex-shrink-0" />
                  <span className="text-sm">{data.phone}</span>
                </div>
              )}
              {data.location && (
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 text-white/80 flex-shrink-0" />
                  <span className="text-sm truncate">{data.location}</span>
                </div>
              )}
              {data.website && (
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faGlobe} className="w-5 text-white/80 flex-shrink-0" />
                  <span className="text-sm truncate">{data.website}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(data.socials?.facebook || data.socials?.linkedin || data.socials?.github || data.socials?.twitter) && (
              <div>
                <p className="text-xs opacity-70 mb-3">Connect with me:</p>
                <div className="flex gap-3">
                  {data.socials.facebook && (
                    <a 
                      href={data.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
                    >
                      <FontAwesomeIcon icon={faFacebookF} className="text-sm" />
                    </a>
                  )}
                  {data.socials.linkedin && (
                    <a 
                      href={data.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
                    >
                      <FontAwesomeIcon icon={faLinkedinIn} className="text-sm" />
                    </a>
                  )}
                  {data.socials.github && (
                    <a 
                      href={data.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
                    >
                      <FontAwesomeIcon icon={faGithub} className="text-sm" />
                    </a>
                  )}
                  {data.socials.twitter && (
                    <a 
                      href={data.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
                    >
                      <FontAwesomeIcon icon={faTwitter} className="text-sm" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Powered By */}
            <div className="mt-4 text-right">
              <p className="text-xs opacity-50">Powered by Cosma 🚀</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}