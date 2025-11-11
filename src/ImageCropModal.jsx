// src/ImageCropModal.jsx - WITH USER GUIDANCE
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg, removeImageBackground } from './utils/imageUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, 
  faCheckCircle, 
  faTimesCircle,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';

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
  
  const [removeBackground, setRemoveBackground] = useState(showBackgroundRemoval);
  const [threshold, setThreshold] = useState(230);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTips, setShowTips] = useState(true); // Show tips by default

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

      // Step 1: Crop
      let processedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        0
      );

      // Step 2: Remove background if enabled
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
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800">
            {showBackgroundRemoval ? 'Adjust Brand Logo' : 'Adjust Profile Photo'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
          >
            ×
          </button>
        </div>

        {/* Tips Banner - For Logo only */}
        {showBackgroundRemoval && showTips && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  💡 Tips for best results:
                </p>
                <p className="text-xs text-gray-600">
                  Use logos with <span className="font-bold text-blue-600">white or light-colored backgrounds</span> for best automatic background removal.
                </p>
              </div>
              <button 
                onClick={() => setShowTips(false)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Crop Area */}
          <div className="relative h-[400px] bg-gradient-to-br from-gray-900 to-gray-800">
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

          {/* Controls */}
          <div className="px-6 py-5 space-y-5 bg-gray-50">
            
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

            {/* Background Removal Section (Logo only) */}
            {showBackgroundRemoval && (
              <>
                <div className="border-t border-gray-200 pt-5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-1">
                        Remove Background
                      </span>
                      <span className="text-xs text-gray-500">
                        Works best with white/light backgrounds
                      </span>
                    </div>
                    <div className="relative ml-4">
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
                  <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">Sensitivity</span>
                      <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">{threshold}</span>
                    </div>
                    <input
                      type="range"
                      min={180}
                      max={250}
                      value={threshold}
                      onChange={(e) => setThreshold(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#ffcb66]"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>Less removal</span>
                      <span>More removal</span>
                    </div>

                    {/* Background Guide */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />
                        What backgrounds work best?
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-gray-700">✅ Best:</span>
                            <span className="text-gray-600"> Pure white, off-white, light gray</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-gray-700">✅ Good:</span>
                            <span className="text-gray-600"> Light pastel colors, cream</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <FontAwesomeIcon icon={faTimesCircle} className="text-orange-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-gray-700">⚠️ Difficult:</span>
                            <span className="text-gray-600"> Dark colors, gradients, patterns</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-[10px] text-gray-500">
                          💡 <span className="font-semibold">Pro tip:</span> If your logo has a complex background, edit it in Photoshop or use <a href="https://remove.bg" target="_blank" className="text-blue-600 hover:underline">remove.bg</a> first for best results.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex gap-3 flex-shrink-0">
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