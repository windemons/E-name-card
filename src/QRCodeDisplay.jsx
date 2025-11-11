import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload,
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

// Icon mapping for center logo
const ICON_EMOJIS = {
  rocket: '🚀',
  star: '⭐',
  heart: '❤️',
  bolt: '⚡',
  crown: '👑',
  fire: '🔥',
  diamond: '💎',
  trophy: '🏆',
  gem: '💍',
  medal: '🥇'
};

export default function QRCodeDisplay({ cardData }) {
  const canvasRef = useRef(null);
  const [qrImageUrl, setQrImageUrl] = useState(null);

  const handleDownload = () => {
    if (!qrImageUrl) return;
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `${cardData.name || 'card'}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate base QR code URL
  const generateBaseQRURL = () => {
    if (!cardData) return null;

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

    const encodedData = encodeURIComponent(vCardData);
    return `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodedData}&format=png`;
  };

  // Draw QR with shape frame and decorative border
  useEffect(() => {
    const drawCustomQR = async () => {
      const baseQR = generateBaseQRURL();
      if (!baseQR || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Large canvas for high quality
      const size = 800;
      canvas.width = size;
      canvas.height = size;

      // Clear canvas with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size, size);

      try {
        // 1. Draw decorative border/sticker (outermost layer - keeps QR scannable)
        drawDecorativeBorder(ctx, size, cardData.qrSticker, cardData.colorTheme);

        // 2. Draw frame shape FIRST (background layer - must be LARGER than QR)
        drawFrameShape(ctx, size, cardData.qrShape, cardData.colorTheme);

        // 3. Load and draw base QR code (SMALLER - on top of frame)
        const qrImage = new Image();
        qrImage.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          qrImage.onload = resolve;
          qrImage.onerror = reject;
          qrImage.src = baseQR;
        });

        // Draw QR SMALLER so all frame shapes are fully visible with LOTS of space
        const qrSize = 280; // Reduced from 320 to show even more frame (185px margin!)
        const qrX = (size - qrSize) / 2;
        const qrY = (size - qrSize) / 2;
        ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

        // 4. Draw center logo ONLY if selected - SMALL and SIMPLE
        if (cardData.qrLogo || cardData.qrCenterIcon) {
          await drawCenterLogo(ctx, size, cardData);
        }

        // Convert to image
        const dataUrl = canvas.toDataURL('image/png');
        setQrImageUrl(dataUrl);

      } catch (error) {
        console.error('Error drawing QR:', error);
        setQrImageUrl(baseQR);
      }
    };

    drawCustomQR();
  }, [cardData]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* QR Display */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-4">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800">{cardData.name || 'Your Card'}</h3>
          {cardData.title && <p className="text-xs text-gray-600">{cardData.title}</p>}
        </div>

        {qrImageUrl ? (
          <img 
            src={qrImageUrl} 
            alt="Custom QR Code" 
            className="w-96 h-96 rounded-xl"
          />
        ) : (
          <div className="w-96 h-96 bg-gray-100 rounded-xl flex items-center justify-center">
            <p className="text-gray-400 animate-pulse">Generating QR...</p>
          </div>
        )}

        {/* Customization Info */}
        <div className="w-full text-center text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-center gap-4">
            {cardData.qrShape && cardData.qrShape !== 'none' && (
              <span className="font-semibold">Frame: <span className="text-gray-800 capitalize">{cardData.qrShape}</span></span>
            )}
            {cardData.qrSticker && cardData.qrSticker !== 'none' && (
              <span className="font-semibold">Border: <span className="text-gray-800 capitalize">{cardData.qrSticker.replace('-', ' ')}</span></span>
            )}
            {(cardData.qrCenterIcon || cardData.qrLogo) && (
              <span className="font-semibold">Center: <span className="text-gray-800">{cardData.qrLogo ? 'Custom Logo' : 'Icon'}</span></span>
            )}
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={!qrImageUrl}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#ffcb66', color: '#000' }}
      >
        <FontAwesomeIcon icon={faDownload} />
        <span>Download QR Code</span>
      </button>
    </div>
  );
}

// Helper: Draw decorative border around everything (LARGEST LAYER)
function drawDecorativeBorder(ctx, size, stickerId, colorTheme) {
  if (!stickerId || stickerId === 'none') return;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 25; // MUCH LARGER radius (was 40, now 25 for bigger border)
  const primary = colorTheme?.primary || '#00343d';
  const accent = colorTheme?.accent || '#3b82f6';

  ctx.save();
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;

  switch (stickerId) {
    case 'christmas-wreath':
      // Green wreath with LARGER dots
      ctx.strokeStyle = '#22c55e';
      ctx.fillStyle = '#22c55e';
      ctx.lineWidth = 24;
      for (let i = 0; i < 20; i++) { // More dots
        const angle = (i / 20) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2); // Much bigger dots
        ctx.fill();
      }
      break;

    case 'flower-border':
      // MUCH larger flower petals around
      ctx.fillStyle = '#ec4899';
      for (let i = 0; i < 16; i++) { // More petals
        const angle = (i / 16) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.arc(x, y, 35, 0, Math.PI * 2); // HUGE petals
        ctx.fill();
      }
      break;

    case 'vintage-frame':
      // Ornate THICKER double frame
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 16;
      const margin1 = 40;
      const margin2 = 65;
      ctx.strokeRect(margin1, margin1, size - margin1*2, size - margin1*2);
      ctx.strokeRect(margin2, margin2, size - margin2*2, size - margin2*2);
      break;

    case 'ribbon-badge':
      // BIGGER ribbon corners
      ctx.fillStyle = '#ef4444';
      const ribbonSize = 80;
      const corners = [
        [60, 60], [size - 60, 60], [60, size - 60], [size - 60, size - 60]
      ];
      corners.forEach(([x, y]) => {
        ctx.fillRect(x - ribbonSize/2, y - 10, ribbonSize, 20);
        ctx.fillRect(x - 10, y - ribbonSize/2, 20, ribbonSize);
      });
      break;

    case 'laurel-wreath':
      // MUCH larger laurel leaves
      ctx.fillStyle = '#16a34a';
      for (let i = 0; i < 24; i++) { // More leaves
        const angle = (i / 24) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * (radius - 5);
        const y = centerY + Math.sin(angle) * (radius - 5);
        ctx.beginPath();
        ctx.ellipse(x, y, 22, 11, angle, 0, Math.PI * 2); // BIGGER leaves
        ctx.fill();
      }
      break;

    case 'sunburst':
      // MUCH longer and thicker rays
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 14; // Thicker rays
      for (let i = 0; i < 40; i++) { // More rays
        const angle = (i / 40) * Math.PI * 2;
        const x1 = centerX + Math.cos(angle) * (radius - 100);
        const y1 = centerY + Math.sin(angle) * (radius - 100);
        const x2 = centerX + Math.cos(angle) * radius;
        const y2 = centerY + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      break;

    case 'dotted-border':
      // MUCH larger dotted circle
      ctx.strokeStyle = primary;
      ctx.lineWidth = 10;
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      break;

    case 'scallop-edge':
      // MUCH larger scalloped circle
      ctx.fillStyle = accent;
      const scallops = 28; // More scallops
      for (let i = 0; i < scallops; i++) {
        const angle = (i / scallops) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.arc(x, y, 28, 0, Math.PI * 2); // HUGE scallops
        ctx.fill();
      }
      break;

    case 'geometric':
      // MUCH larger geometric triangles
      ctx.strokeStyle = primary;
      ctx.lineWidth = 8;
      for (let i = 0; i < 20; i++) { // More triangles
        const angle = (i / 20) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 30 * Math.cos(angle), y + 30 * Math.sin(angle));
        ctx.lineTo(x - 30 * Math.sin(angle), y + 30 * Math.cos(angle));
        ctx.closePath();
        ctx.stroke();
      }
      break;
  }

  ctx.restore();
}

// Helper: Draw frame shape (MUST BE LARGER THAN QR to show around it!)
function drawFrameShape(ctx, size, shapeId, colorTheme) {
  if (!shapeId || shapeId === 'none') return;

  const centerX = size / 2;
  const centerY = size / 2;
  const frameSize = 650; // MUCH LARGER frame (QR is 320, so frame shows 165px around it - perfect ratio!)
  const primary = colorTheme?.primary || '#00343d';

  ctx.save();
  ctx.fillStyle = 'white';
  ctx.strokeStyle = primary;
  ctx.lineWidth = 12; // Thick visible border

  switch (shapeId) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(centerX, centerY, frameSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    case 'diamond':
      // Diamond shape (kim cương) - dễ hiển thị và sang trọng
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - frameSize / 2); // Top
      ctx.lineTo(centerX + frameSize / 2, centerY); // Right
      ctx.lineTo(centerX, centerY + frameSize / 2); // Bottom
      ctx.lineTo(centerX - frameSize / 2, centerY); // Left
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'hexagon':
      // Hexagon - LARGE
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (frameSize / 2);
        const y = centerY + Math.sin(angle) * (frameSize / 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'star':
      // 5-pointed star - IMPROVED with better proportions
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const radius = i % 2 === 0 ? frameSize / 2 : frameSize / 3.2; // Better inner/outer ratio
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'pentagon':
      // Pentagon (ngũ giác) - unique and elegant
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (frameSize / 2);
        const y = centerY + Math.sin(angle) * (frameSize / 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'square-rounded':
      // Rounded square - SMALLER for better proportion
      const cornerRadius = 60;
      const squareSize = frameSize * 0.75; // Reduced from full frameSize (75% size)
      ctx.beginPath();
      ctx.roundRect(
        centerX - squareSize / 2,
        centerY - squareSize / 2,
        squareSize,
        squareSize,
        cornerRadius
      );
      ctx.fill();
      ctx.stroke();
      break;

    case 'badge':
      // Badge with notches - LARGE
      const notchSize = 45;
      const notches = 12;
      ctx.beginPath();
      for (let i = 0; i < notches; i++) {
        const angle1 = (i / notches) * Math.PI * 2;
        const angle2 = ((i + 0.5) / notches) * Math.PI * 2;
        const outerX1 = centerX + Math.cos(angle1) * (frameSize / 2);
        const outerY1 = centerY + Math.sin(angle1) * (frameSize / 2);
        const innerX = centerX + Math.cos(angle2) * (frameSize / 2 - notchSize);
        const innerY = centerY + Math.sin(angle2) * (frameSize / 2 - notchSize);
        
        if (i === 0) ctx.moveTo(outerX1, outerY1);
        else ctx.lineTo(outerX1, outerY1);
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'octagon':
      // Octagon (bát giác) - độc đáo và dễ hiển thị
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 - Math.PI / 8;
        const x = centerX + Math.cos(angle) * (frameSize / 2);
        const y = centerY + Math.sin(angle) * (frameSize / 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'shield':
      // Shield shape - SMALLER for better proportion
      const shieldSize = frameSize * 0.8; // Reduced from full frameSize (80% size)
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - shieldSize / 2);
      ctx.lineTo(centerX + shieldSize / 2, centerY - shieldSize / 3);
      ctx.lineTo(centerX + shieldSize / 2, centerY + shieldSize / 4);
      ctx.quadraticCurveTo(centerX + shieldSize / 2, centerY + shieldSize / 2, centerX, centerY + shieldSize / 2);
      ctx.quadraticCurveTo(centerX - shieldSize / 2, centerY + shieldSize / 2, centerX - shieldSize / 2, centerY + shieldSize / 4);
      ctx.lineTo(centerX - shieldSize / 2, centerY - shieldSize / 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
  }

  ctx.restore();
}

// Helper: Draw center logo - SMALL and SIMPLE (no colored circle!)
async function drawCenterLogo(ctx, size, cardData) {
  // Only draw if user selected something
  if (!cardData.qrLogo && !cardData.qrCenterIcon) return;

  const centerX = size / 2;
  const centerY = size / 2;
  const logoSize = 70; // MUCH SMALLER (was 110) - ensures QR scannable

  // Only white background circle - NO colored circle
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(centerX, centerY, logoSize / 2, 0, Math.PI * 2);
  ctx.fill();

  // Optional: thin border for visibility
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Draw logo or icon directly on white background
  if (cardData.qrLogo) {
    // Custom logo - SMALL
    const logoImage = new Image();
    await new Promise((resolve) => {
      logoImage.onload = resolve;
      logoImage.onerror = resolve;
      logoImage.src = cardData.qrLogo;
    });
    ctx.drawImage(
      logoImage,
      centerX - logoSize / 2 + 8,
      centerY - logoSize / 2 + 8,
      logoSize - 16, // Smaller with padding
      logoSize - 16
    );
  } else if (cardData.qrCenterIcon) {
    // Icon (emoji) - SMALL
    const emoji = ICON_EMOJIS[cardData.qrCenterIcon];
    if (emoji) {
      ctx.font = 'bold 32px Arial'; // Smaller font (was 55px)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = cardData.colorTheme?.primary || '#00343d';
      ctx.fillText(emoji, centerX, centerY);
    }
  }
}