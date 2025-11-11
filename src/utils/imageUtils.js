// src/utils/imageUtils.js

/**
 * Create image from data URL
 */
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

/**
 * Crop image based on cropped area pixels
 */
export async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  return canvas.toDataURL('image/png');
}

/**
 * Advanced background removal with better edge detection
 * @param {string} imageSrc - Base64 image data
 * @param {number} threshold - Sensitivity (150-250, default 220)
 * @returns {Promise<string>} - Base64 image with transparent background
 */
export async function removeImageBackground(imageSrc, threshold = 220) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = image.width;
  canvas.height = image.height;

  // Draw image
  ctx.drawImage(image, 0, 0);

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Analyze corners to determine background color (improved algorithm)
  const cornerSamples = [
    // Top-left corner (larger sample area)
    ...getAreaSamples(data, canvas.width, 0, 0, 20, 20),
    // Top-right corner
    ...getAreaSamples(data, canvas.width, canvas.width - 20, 0, 20, 20),
    // Bottom-left corner
    ...getAreaSamples(data, canvas.width, 0, canvas.height - 20, 20, 20),
    // Bottom-right corner
    ...getAreaSamples(data, canvas.width, canvas.width - 20, canvas.height - 20, 20, 20),
  ];

  // Calculate average background color
  const avgBg = calculateAverageColor(cornerSamples);

  // Process each pixel
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Calculate color difference from background
    const diff = Math.sqrt(
      Math.pow(r - avgBg.r, 2) +
      Math.pow(g - avgBg.g, 2) +
      Math.pow(b - avgBg.b, 2)
    );

    // If similar to background, make transparent
    if (diff < threshold) {
      // Smooth transparency based on similarity
      const alpha = Math.min(255, (diff / threshold) * 255);
      data[i + 3] = alpha;
    } else {
      // Keep original alpha for foreground
      data[i + 3] = 255;
    }
  }

  // Apply edge smoothing (anti-aliasing)
  applyEdgeSmoothing(data, canvas.width, canvas.height);

  // Put processed data back
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL('image/png');
}

/**
 * Get color samples from a rectangular area
 */
function getAreaSamples(data, width, startX, startY, areaWidth, areaHeight) {
  const samples = [];
  
  for (let y = startY; y < startY + areaHeight; y++) {
    for (let x = startX; x < startX + areaWidth; x++) {
      const i = (y * width + x) * 4;
      if (i < data.length) {
        samples.push({
          r: data[i],
          g: data[i + 1],
          b: data[i + 2]
        });
      }
    }
  }
  
  return samples;
}

/**
 * Calculate average color from samples
 */
function calculateAverageColor(samples) {
  if (samples.length === 0) {
    return { r: 255, g: 255, b: 255 }; // Default to white
  }

  const sum = samples.reduce(
    (acc, sample) => ({
      r: acc.r + sample.r,
      g: acc.g + sample.g,
      b: acc.b + sample.b
    }),
    { r: 0, g: 0, b: 0 }
  );

  return {
    r: Math.round(sum.r / samples.length),
    g: Math.round(sum.g / samples.length),
    b: Math.round(sum.b / samples.length)
  };
}

/**
 * Apply edge smoothing to reduce jagged edges
 */
function applyEdgeSmoothing(data, width, height) {
  const tempData = new Uint8ClampedArray(data);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * width + x) * 4;
      const alpha = tempData[i + 3];

      // Only smooth edges (partially transparent pixels)
      if (alpha > 0 && alpha < 255) {
        // Average with neighbors
        const neighbors = [
          tempData[((y - 1) * width + x) * 4 + 3], // top
          tempData[((y + 1) * width + x) * 4 + 3], // bottom
          tempData[(y * width + (x - 1)) * 4 + 3], // left
          tempData[(y * width + (x + 1)) * 4 + 3], // right
        ];

        const avgAlpha = neighbors.reduce((sum, a) => sum + a, alpha) / (neighbors.length + 1);
        data[i + 3] = Math.round(avgAlpha);
      }
    }
  }
}

/**
 * Convert canvas to blob (for file uploads)
 */
export function canvasToBlob(canvas, type = 'image/png', quality = 1) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

/**
 * Resize image to max dimensions (for optimization)
 */
export async function resizeImage(imageSrc, maxWidth = 1000, maxHeight = 1000) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let width = image.width;
  let height = image.height;

  // Calculate new dimensions maintaining aspect ratio
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/png');
}