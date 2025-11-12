import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload,
  faPhone,
  faEnvelope,
  faGlobe,
  faMapMarkerAlt,
  faBriefcase,
  faBuilding,
  faQrcode
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faLinkedin,
  faGithub,
  faTwitter
} from '@fortawesome/free-brands-svg-icons';
import CardPreview from './CardPreview';

export default function PublicCardView({ cardId, onBackToHome }) {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    // Use cardId from props if available, otherwise get from URL
    let id = cardId;
    
    if (!id) {
      const pathParts = window.location.pathname.split('/');
      id = pathParts[pathParts.length - 1];
    }

    // Load card from localStorage
    const sharedCards = JSON.parse(localStorage.getItem('cosma_shared_cards') || '{}');
    const card = sharedCards[id];

    if (card) {
      setCardData(card.data);
      
      // Increment view count
      card.views = (card.views || 0) + 1;
      sharedCards[id] = card;
      localStorage.setItem('cosma_shared_cards', JSON.stringify(sharedCards));
    }

    setLoading(false);
  }, [cardId]);

  const handleDownloadVCard = () => {
    if (!cardData) return;

    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${cardData.name || 'Unknown'}
TITLE:${cardData.title || ''}
ORG:${cardData.company || ''}
TEL:${cardData.phone || ''}
EMAIL:${cardData.email || ''}
ADR:;;${cardData.location || ''};;;
URL:${cardData.website || ''}
${cardData.socials?.facebook ? `URL;type=Facebook:${cardData.socials.facebook}` : ''}
${cardData.socials?.linkedin ? `URL;type=LinkedIn:${cardData.socials.linkedin}` : ''}
${cardData.socials?.github ? `URL;type=GitHub:${cardData.socials.github}` : ''}
${cardData.socials?.twitter ? `URL;type=Twitter:${cardData.socials.twitter}` : ''}
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cardData.name || 'contact'}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleAddToContacts = () => {
    handleDownloadVCard();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#00343d' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ffcb66] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading card...</p>
        </div>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#00343d' }}>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-white mb-2">Card Not Found</h1>
          <p className="text-white/60 mb-6">
            This card may have been removed or the link is invalid.
          </p>
          <a
            href={onBackToHome ? "#" : "/"}
            onClick={(e) => {
              if (onBackToHome) {
                e.preventDefault();
                onBackToHome();
              }
            }}
            className="inline-block px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
            style={{ backgroundColor: '#ffcb66', color: '#000' }}
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#00343d' }}>
      {/* Header */}
      <header className="border-b border-white/10 p-4" style={{ backgroundColor: '#003540' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Cosma</h1>
            <img 
              src="/Logo.png"
              alt="Cosma Logo" 
              className="object-contain"
              style={{ 
                width: '60px',
                height: '40px',
                transform: 'rotate(-20deg)',
                marginLeft: '-15px'
              }}
            />
          </div>
          <button
            onClick={handleAddToContacts}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
            style={{ backgroundColor: '#ffcb66', color: '#000' }}
          >
            <FontAwesomeIcon icon={faDownload} />
            <span>Add to Contacts</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left: Card Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="mb-6">
              <CardPreview cardData={cardData} />
            </div>
            
            <button
              onClick={() => setShowQR(!showQR)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
            >
              <FontAwesomeIcon icon={faQrcode} />
              <span>{showQR ? 'Hide' : 'Show'} QR Code</span>
            </button>

            {showQR && (
              <div className="mt-6 bg-white p-6 rounded-xl">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.href)}`}
                  alt="Card QR Code"
                  className="w-64 h-64"
                />
              </div>
            )}
          </div>

          {/* Right: Contact Info */}
          <div className="space-y-4">
            
            {/* Profile Section */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-6">
                {cardData.avatar ? (
                  <img 
                    src={cardData.avatar} 
                    alt={cardData.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
                    style={{ backgroundColor: '#ffcb66', color: '#000' }}
                  >
                    {cardData.name?.[0] || '?'}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">{cardData.name}</h2>
                  {cardData.title && (
                    <p className="text-white/70 mb-1">{cardData.title}</p>
                  )}
                  {cardData.company && (
                    <p className="text-white/60 flex items-center gap-2">
                      <FontAwesomeIcon icon={faBuilding} className="text-sm" />
                      {cardData.company}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleAddToContacts}
                className="w-full px-4 py-3 rounded-lg font-medium transition-all hover:scale-105"
                style={{ backgroundColor: '#ffcb66', color: '#000' }}
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Save to Phone Contacts
              </button>
            </div>

            {/* Contact Details */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>

              {cardData.email && (
                <a 
                  href={`mailto:${cardData.email}`}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#ffcb66' }}
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/60">Email</p>
                    <p className="text-white font-medium">{cardData.email}</p>
                  </div>
                </a>
              )}

              {cardData.phone && (
                <a 
                  href={`tel:${cardData.phone}`}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#ffcb66' }}
                  >
                    <FontAwesomeIcon icon={faPhone} className="text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/60">Phone</p>
                    <p className="text-white font-medium">{cardData.phone}</p>
                  </div>
                </a>
              )}

              {cardData.website && (
                <a 
                  href={cardData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#ffcb66' }}
                  >
                    <FontAwesomeIcon icon={faGlobe} className="text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/60">Website</p>
                    <p className="text-white font-medium">{cardData.website}</p>
                  </div>
                </a>
              )}

              {cardData.location && (
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#ffcb66' }}
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/60">Location</p>
                    <p className="text-white font-medium">{cardData.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(cardData.socials?.facebook || cardData.socials?.linkedin || cardData.socials?.github || cardData.socials?.twitter) && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Connect on Social Media</h3>
                <div className="grid grid-cols-2 gap-3">
                  {cardData.socials?.facebook && (
                    <a
                      href={cardData.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#1877f2] text-white hover:bg-[#166fe5] transition-all"
                    >
                      <FontAwesomeIcon icon={faFacebook} />
                      <span>Facebook</span>
                    </a>
                  )}
                  {cardData.socials?.linkedin && (
                    <a
                      href={cardData.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0077b5] text-white hover:bg-[#006399] transition-all"
                    >
                      <FontAwesomeIcon icon={faLinkedin} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {cardData.socials?.github && (
                    <a
                      href={cardData.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#333] text-white hover:bg-[#24292e] transition-all"
                    >
                      <FontAwesomeIcon icon={faGithub} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {cardData.socials?.twitter && (
                    <a
                      href={cardData.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#1da1f2] text-white hover:bg-[#1a8cd8] transition-all"
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                      <span>Twitter</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* CTA Banner */}
            <div className="bg-gradient-to-r from-[#ffcb66]/20 to-[#ffcb66]/10 border-2 border-[#ffcb66]/30 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Want your own digital card?</h3>
              <p className="text-white/70 mb-4">Create your professional digital business card in minutes</p>
              <a
                href={onBackToHome ? "#" : "/"}
                onClick={(e) => {
                  if (onBackToHome) {
                    e.preventDefault();
                    onBackToHome();
                  }
                }}
                className="inline-block px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                style={{ backgroundColor: '#ffcb66', color: '#000' }}
              >
                Get Started Free
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-white/60 text-sm">
          <p>Powered by <span className="font-bold text-[#ffcb66]">Cosma</span> - Digital Business Cards</p>
        </div>
      </footer>
    </div>
  );
}