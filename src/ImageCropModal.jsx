// src/ImageCropModal.jsx
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg, removeImageBackground } from './utils/imageUtils';

export default function ImageCropModal({ 
  image,                        
  onClose,                      
  onSave,                       
  aspectRatio = 1,              
  cropShape = 'round',          
  showBackgroundRemoval = false 
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  // Logo: Mặc định BẬT remove background với threshold cao hơn
  const [removeBackground, setRemoveBackground] = useState(showBackgroundRemoval);
  const [threshold, setThreshold] = useState(220); // Tăng từ 200 → 220
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) {
      alert('Please adjust the image first');
      return;
    }

    try {
      setIsProcessing(true);

      // Step 1: Crop ảnh
      let processedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        0
      );

      // Step 2: Remove background nếu là logo và đang bật
      if (showBackgroundRemoval && removeBackground) {
        processedImage = await removeImageBackground(
          processedImage, 
          threshold
        );
      }

      // Step 3: Save
      onSave(processedImage);
      onClose();
    } catch (e) {
      console.error('Error processing image:', e);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header - Compact */}
        <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-800">
            {showBackgroundRemoval ? 'Adjust Logo' : 'Adjust Photo'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Crop Area - Compact */}
          <div className="relative h-[350px] bg-gradient-to-br from-gray-900 to-gray-800">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              cropShape={cropShape}
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: {
                  backgroundColor: 'transparent'
                }
              }}
            />
          </div>

          {/* Controls - Compact */}
          <div className="px-6 py-4 space-y-4 bg-gray-50">
            
            {/* Zoom Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Zoom</span>
                <span className="text-xs text-gray-500">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#ffcb66]"
              />
            </div>

            {/* Background Removal Toggle (Logo only) */}
            {showBackgroundRemoval && (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Remove Background</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={removeBackground}
                        onChange={(e) => setRemoveBackground(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#ffcb66] transition-all"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                    </div>
                  </label>
                </div>

                {removeBackground && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">Sensitivity</span>
                      <span className="text-xs text-gray-500">{threshold}</span>
                    </div>
                    <input
                      type="range"
                      min={150}
                      max={250}
                      value={threshold}
                      onChange={(e) => setThreshold(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#ffcb66]"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Actions - Always Visible at Bottom */}
        <div className="px-6 py-3 bg-white border-t border-gray-200 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 bg-[#ffcb66] text-black rounded-lg font-medium hover:bg-[#ffc04d] transition-all shadow-md disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                Processing
              </span>
            ) : (
              'Apply & Save'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}