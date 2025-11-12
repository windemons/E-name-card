import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes,
  faCopy,
  faCheck,
  faQrcode,
  faEnvelope,
  faLink,
  faDownload,
  faGlobe,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faTwitter,
  faLinkedin,
  faWhatsapp,
  faTelegram
} from '@fortawesome/free-brands-svg-icons';

export default function ShareCardModal({ cardData, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [shareMethod, setShareMethod] = useState('link');

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setCopied(false);
      setShareMethod('link');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && cardData) {
      try {
        // Generate unique share link
        const cardId = cardData.id || Date.now();
        const shareLink = `${window.location.origin}/card/${cardId}`;
        setShareUrl(shareLink);

        // Generate QR code for share link
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareLink)}`;
        setQrCodeUrl(qrUrl);

        // Save shared card with optimized data (NO IMAGES to avoid quota)
        saveSharedCardOptimized(cardId, cardData);
      } catch (error) {
        console.error('Error in ShareCardModal:', error);
      }
    }
  }, [isOpen, cardData]);

  // Optimized save - removes heavy base64 images to prevent quota exceeded
  const saveSharedCardOptimized = (cardId, data) => {
    try {
      // Create lightweight copy without base64 images
      const lightData = {
        ...data,
        avatar: null,  // Remove base64 avatar
        brandPhoto: null,  // Remove base64 brand photo
        qrLogo: null  // Remove QR logo if exists
      };

      const sharedCards = JSON.parse(localStorage.getItem('cosma_shared_cards') || '{}');
      
      // Limit to max 50 shared cards to prevent storage overflow
      const cardIds = Object.keys(sharedCards);
      if (cardIds.length >= 50) {
        // Remove oldest cards
        const sortedIds = cardIds.sort((a, b) => {
          const dateA = new Date(sharedCards[a].sharedAt);
          const dateB = new Date(sharedCards[b].sharedAt);
          return dateA - dateB;
        });
        // Remove oldest 10
        for (let i = 0; i < 10; i++) {
          delete sharedCards[sortedIds[i]];
        }
      }

      sharedCards[cardId] = {
        data: lightData,  // Use lightweight data
        sharedAt: new Date().toISOString(),
        views: 0
      };

      localStorage.setItem('cosma_shared_cards', JSON.stringify(sharedCards));
    } catch (err) {
      console.error('Error saving shared card:', err);
      
      // If still quota exceeded, clear old shares and try again
      if (err.name === 'QuotaExceededError') {
        try {
          // Emergency cleanup - keep only last 10 shares
          const allCards = JSON.parse(localStorage.getItem('cosma_shared_cards') || '{}');
          const sortedIds = Object.keys(allCards).sort((a, b) => {
            return new Date(allCards[b].sharedAt) - new Date(allCards[a].sharedAt);
          });
          
          const keepCards = {};
          for (let i = 0; i < Math.min(10, sortedIds.length); i++) {
            keepCards[sortedIds[i]] = allCards[sortedIds[i]];
          }
          
          localStorage.setItem('cosma_shared_cards', JSON.stringify(keepCards));
          
          // Try saving current card again
          const lightData = { ...data, avatar: null, brandPhoto: null, qrLogo: null };
          keepCards[cardId] = {
            data: lightData,
            sharedAt: new Date().toISOString(),
            views: 0
          };
          localStorage.setItem('cosma_shared_cards', JSON.stringify(keepCards));
        } catch (cleanupErr) {
          console.error('Cleanup failed:', cleanupErr);
          alert('Storage full. Please clear browser data or use fewer shared cards.');
        }
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${cardData?.name || 'card'}-share-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEmailShare = () => {
    const subject = `Check out my digital business card - ${cardData?.name}`;
    const body = `Hi,\n\nI'd like to share my digital business card with you.\n\nView my card: ${shareUrl}\n\nBest regards,\n${cardData?.name}`;
    
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Use iframe method to avoid navigation
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = mailtoLink;
    document.body.appendChild(iframe);
    
    setTimeout(() => {
      try {
        document.body.removeChild(iframe);
      } catch (e) {
        // Ignore if already removed
      }
    }, 1000);
  };

  const handleSocialShare = (platform) => {
    const text = `Check out my digital business card - ${cardData?.name}`;
    let url = '';

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400,noopener,noreferrer');
    }
  };

  const handlePreview = () => {
    window.open(shareUrl, '_blank');
  };

  if (!isOpen) return null;

  // Safety check
  if (!cardData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-[#003540] rounded-2xl p-6 text-center max-w-md">
          <p className="text-white text-lg mb-4">⚠️ No card data available</p>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg font-medium"
            style={{ backgroundColor: '#ffcb66', color: '#000' }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ backgroundColor: '#003540' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#003540]">
          <div>
            <h2 className="text-2xl font-bold text-white">Share Card</h2>
            <p className="text-sm text-white/60 mt-1">Share your digital business card with anyone</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white transition-all"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Method Tabs */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
            <button
              onClick={() => setShareMethod('link')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                shareMethod === 'link'
                  ? 'bg-[#ffcb66] text-black'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <FontAwesomeIcon icon={faLink} className="mr-2" />
              Link
            </button>
            <button
              onClick={() => setShareMethod('qr')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                shareMethod === 'qr'
                  ? 'bg-[#ffcb66] text-black'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <FontAwesomeIcon icon={faQrcode} className="mr-2" />
              QR Code
            </button>
            <button
              onClick={() => setShareMethod('email')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                shareMethod === 'email'
                  ? 'bg-[#ffcb66] text-black'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Email
            </button>
            <button
              onClick={() => setShareMethod('social')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                shareMethod === 'social'
                  ? 'bg-[#ffcb66] text-black'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <FontAwesomeIcon icon={faGlobe} className="mr-2" />
              Social
            </button>
          </div>

          {/* Link Sharing */}
          {shareMethod === 'link' && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faLink} />
                  Share Link
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  Anyone with this link can view your card
                </p>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-lg bg-[#00343d] border border-white/10 text-white text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                    style={{ backgroundColor: copied ? '#10b981' : '#ffcb66', color: '#000' }}
                  >
                    <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="mr-2" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faEye} />
                  Preview
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  See how your card looks to others
                </p>
                <button
                  onClick={handlePreview}
                  className="w-full px-4 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
                >
                  <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                  Open Preview in New Tab
                </button>
              </div>
            </div>
          )}

          {/* QR Code Sharing */}
          {shareMethod === 'qr' && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faQrcode} />
                  QR Code
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  Scan this QR code to view your card
                </p>
                
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-xl">
                    <img 
                      src={qrCodeUrl} 
                      alt="Share QR Code" 
                      className="w-64 h-64"
                    />
                  </div>
                  
                  <button
                    onClick={handleDownloadQR}
                    className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                    style={{ backgroundColor: '#ffcb66', color: '#000' }}
                  >
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Download QR Code
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Email Sharing */}
          {shareMethod === 'email' && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} />
                  Share via Email
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  Send your card through email
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={handleEmailShare}
                    className="w-full px-4 py-3 rounded-lg font-medium transition-all hover:scale-105"
                    style={{ backgroundColor: '#ffcb66', color: '#000' }}
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Open Email Client
                  </button>

                  <div className="p-4 bg-[#00343d] rounded-lg border border-white/10">
                    <p className="text-xs text-white/60 mb-2">Email Preview:</p>
                    <div className="text-sm text-white/80 space-y-2">
                      <p><strong>Subject:</strong> Check out my digital business card - {cardData?.name}</p>
                      <p><strong>Body:</strong></p>
                      <p className="text-white/60 text-xs whitespace-pre-line pl-4">
                        Hi,{'\n\n'}
                        I'd like to share my digital business card with you.{'\n\n'}
                        View my card: {shareUrl}{'\n\n'}
                        Best regards,{'\n'}
                        {cardData?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Sharing */}
          {shareMethod === 'social' && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faGlobe} />
                  Share on Social Media
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  Share your card on your favorite platform
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSocialShare('facebook')}
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-[#1877f2] text-white hover:bg-[#166fe5] transition-all"
                  >
                    <FontAwesomeIcon icon={faFacebook} className="text-xl" />
                    <span className="font-medium">Facebook</span>
                  </button>

                  <button
                    onClick={() => handleSocialShare('twitter')}
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-[#1da1f2] text-white hover:bg-[#1a8cd8] transition-all"
                  >
                    <FontAwesomeIcon icon={faTwitter} className="text-xl" />
                    <span className="font-medium">Twitter</span>
                  </button>

                  <button
                    onClick={() => handleSocialShare('linkedin')}
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-[#0077b5] text-white hover:bg-[#006399] transition-all"
                  >
                    <FontAwesomeIcon icon={faLinkedin} className="text-xl" />
                    <span className="font-medium">LinkedIn</span>
                  </button>

                  <button
                    onClick={() => handleSocialShare('whatsapp')}
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-[#25d366] text-white hover:bg-[#20bd5a] transition-all"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
                    <span className="font-medium">WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleSocialShare('telegram')}
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-[#0088cc] text-white hover:bg-[#0077b5] transition-all col-span-2"
                  >
                    <FontAwesomeIcon icon={faTelegram} className="text-xl" />
                    <span className="font-medium">Telegram</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Share Link Status</p>
                <p className="text-white font-semibold">Active & Public</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-sm">Storage</p>
                <p className="text-white font-semibold text-sm">Optimized ✓</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-white/10 bg-[#003540]">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}