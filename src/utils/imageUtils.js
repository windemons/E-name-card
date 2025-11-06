// src/utils/imageUtils.js

/**
 * Create image element from URL
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
 * Get radians from degrees
 */
function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Crop image theo vùng đã chọn
 * @param {string} imageSrc - Base64 hoặc URL của ảnh
 * @param {Object} pixelCrop - Vùng crop {x, y, width, height}
 * @param {number} rotation - Góc xoay (degrees)
 * @returns {Promise<string>} Base64 của ảnh đã crop
 */
export async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // Calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // Set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // Set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // As Base64 string
  return canvas.toDataURL('image/png');
}

/**
 * Remove background dựa trên màu - IMPROVED VERSION
 * Thuật toán: Detect solid color backgrounds (white, light gray, etc.)
 * @param {string} imageSrc - Base64 của ảnh
 * @param {number} threshold - Ngưỡng brightness (0-255), cao hơn = remove nhiều hơn
 * @returns {Promise<string>} Base64 của ảnh đã remove background
 */
export async function removeImageBackground(imageSrc, threshold = 200) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return imageSrc;
  }

  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Loop qua từng pixel
  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];
    const alpha = data[i + 3];

    // Skip nếu đã trong suốt
    if (alpha === 0) continue;

    // Calculate brightness (weighted for human perception)
    const brightness = (red * 0.299 + green * 0.587 + blue * 0.114);

    // Calculate color variance (để detect solid color)
    const colorVariance = 
      Math.abs(red - green) + 
      Math.abs(green - blue) + 
      Math.abs(blue - red);

    // Detect white/light backgrounds with improved logic
    const isLikelyBackground = brightness > threshold && colorVariance < 40;

    // Nếu là background → làm trong suốt
    if (isLikelyBackground) {
      data[i + 3] = 0; // Set alpha = 0 (transparent)
    } else if (brightness > threshold - 20 && brightness <= threshold && colorVariance < 40) {
      // Soft edge: Làm mờ dần cho edge mượt hơn
      const fadeRatio = (brightness - (threshold - 20)) / 20;
      data[i + 3] = Math.floor(alpha * (1 - fadeRatio));
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(imageSrc) {
  const image = await createImage(imageSrc);
  return {
    width: image.width,
    height: image.height
  };
}

/**
 * Check if image has transparency
 */
export async function hasTransparency(imageSrc) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return false;

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Check alpha channel
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) {
      return true; // Found transparent pixel
    }
  }

  return false; // No transparency found
}