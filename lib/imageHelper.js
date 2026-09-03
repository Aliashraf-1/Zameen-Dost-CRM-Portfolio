// lib/imageHelper.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

export const getImageUrl = (imagePath) => {
  console.log("📸 getImageUrl input:", imagePath);
  
  if (!imagePath) {
    console.log("❌ No image path provided");
    return null;
  }
  
  // ✅ If already a full URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log("✅ Full URL:", imagePath);
    return imagePath;
  }
  
  // ✅ If path starts with /uploads/ (with slash)
  if (imagePath.startsWith('/uploads/')) {
    const url = `${BASE_URL}${imagePath}`;
    console.log("✅ Path with /uploads/:", url);
    return url;
  }
  
  // ✅ If path starts with uploads/ (without slash)
  if (imagePath.startsWith('uploads/')) {
    const url = `${BASE_URL}/${imagePath}`;
    console.log("✅ Path without slash:", url);
    return url;
  }
  
  // ✅ If path is just a filename
  if (!imagePath.startsWith('/')) {
    const url = `${BASE_URL}/uploads/${imagePath}`;
    console.log("✅ Filename only:", url);
    return url;
  }
  
  console.log("⚠️ Fallback path:", imagePath);
  return imagePath;
};

export const getFallbackImage = (type = 'unit') => {
  const fallbacks = {
    unit: 'https://placehold.co/800x400/1e293b/94a3b8?text=No+Image',
    tenant: 'https://placehold.co/100x100/1e293b/94a3b8?text=User',
    building: 'https://placehold.co/200x200/1e293b/94a3b8?text=Building',
  };
  return fallbacks[type] || fallbacks.unit;
};