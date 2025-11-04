import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faGlobe,
  faBriefcase
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, 
  faLinkedinIn, 
  faGithub,
  faTwitter 
} from '@fortawesome/free-brands-svg-icons';

export default function CardPreview({ cardData }) {
  // Mock data - sau này sẽ nhận từ props hoặc API
  const defaultCardData = {
    name: 'Nguyễn Văn A',
    title: 'Full Stack Developer',
    company: 'Cosma Tech',
    email: 'nguyenvana@example.com',
    phone: '+84 123 456 789',
    location: 'Hồ Chí Minh, Việt Nam',
    website: 'https://example.com',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&size=200&background=ffcb66&color=000',
    theme: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      colors: ['#667eea', '#764ba2', '#f093fb']
    },
    socials: {
      facebook: 'https://facebook.com',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    }
  };

  const data = cardData || defaultCardData;

  return (
    <div className="relative w-full">
      {/* Horizontal Card Layout */}
      <div 
        className="w-full max-w-[600px] mx-auto rounded-2xl shadow-2xl overflow-hidden relative"
        style={{
          aspectRatio: '700 / 380',
          background: data.theme?.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-8 right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-8 left-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
        </div>

        {/* Content - Flex Row for Horizontal Layout */}
        <div className="relative h-full flex flex-row text-white">
          {/* Left Side - Avatar and Name */}
          <div className="w-2/5 flex flex-col items-center justify-center p-4 md:p-6 border-r border-white/20">
            {/* Avatar */}
            <div className="mb-3">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white/30 overflow-hidden shadow-xl">
                <img 
                  src={data.avatar} 
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name & Title */}
            <div className="text-center">
              <h2 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">{data.name}</h2>
              <p className="text-xs md:text-base opacity-90 mb-1">{data.title}</p>
              <p className="text-xs md:text-sm opacity-75">{data.company}</p>
            </div>
          </div>

          {/* Right Side - Contact Info & Social */}
          <div className="flex-1 flex flex-col justify-center p-4 md:p-8">
            {/* Contact Info */}
            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 md:w-5 text-white/80 flex-shrink-0" />
                <span className="text-xs md:text-sm truncate">{data.email}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <FontAwesomeIcon icon={faPhone} className="w-4 md:w-5 text-white/80 flex-shrink-0" />
                <span className="text-xs md:text-sm">{data.phone}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 md:w-5 text-white/80 flex-shrink-0" />
                <span className="text-xs md:text-sm truncate">{data.location}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <FontAwesomeIcon icon={faGlobe} className="w-4 md:w-5 text-white/80 flex-shrink-0" />
                <span className="text-xs md:text-sm truncate">{data.website}</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div>
              <p className="text-xs opacity-70 mb-2 md:mb-3">Connect with me:</p>
              <div className="flex gap-2 md:gap-3">
                {data.socials.facebook && (
                  <a 
                    href={data.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <FontAwesomeIcon icon={faFacebookF} className="text-xs md:text-sm" />
                  </a>
                )}
                {data.socials.linkedin && (
                  <a 
                    href={data.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <FontAwesomeIcon icon={faLinkedinIn} className="text-xs md:text-sm" />
                  </a>
                )}
                {data.socials.github && (
                  <a 
                    href={data.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <FontAwesomeIcon icon={faGithub} className="text-xs md:text-sm" />
                  </a>
                )}
                {data.socials.twitter && (
                  <a 
                    href={data.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <FontAwesomeIcon icon={faTwitter} className="text-xs md:text-sm" />
                  </a>
                )}
              </div>
            </div>

            {/* Powered by */}
            <div className="mt-3 md:mt-4 text-right">
              <p className="text-xs opacity-50">Powered by Cosma 🚀</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}