import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using the environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a single image to Cloudinary if it is a base64 string.
 * If it is already a URL or is empty, returns it as-is.
 */
export async function uploadImage(imageStr: string | null | undefined): Promise<string | null> {
  if (!imageStr) return null;

  // Check if it is a base64 data URI (e.g. data:image/png;base64,... or data:video/mp4;base64,...)
  if (imageStr.startsWith('data:image/') || imageStr.startsWith('data:video/')) {
    try {
      const isVideo = imageStr.startsWith('data:video/');
      const response = await cloudinary.uploader.upload(imageStr, {
        folder: 'majh-boisar',
        resource_type: isVideo ? 'video' : 'auto',
      });
      return response.secure_url;
    } catch (error) {
      console.error('Error uploading media to Cloudinary:', error);
      // Fallback: return the original base64 string so the application doesn't crash
      return imageStr;
    }
  }

  return imageStr;
}

/**
 * Uploads multiple images or media items (an array of base64 strings or URLs) to Cloudinary.
 */
export async function uploadGallery(gallery: string[] | null | undefined): Promise<string[]> {
  if (!gallery || !Array.isArray(gallery)) return [];
  
  const uploadPromises = gallery.map((img) => uploadImage(img));
  const results = await Promise.all(uploadPromises);
  
  // Filter out null/undefined results and cast to string[]
  return results.filter((url): url is string => url !== null);
}

/**
 * Uploads a document or image file to Cloudinary if it is a base64 string.
 */
export async function uploadFile(fileStr: string | null | undefined): Promise<string | null> {
  if (!fileStr) return null;

  if (fileStr.startsWith('data:')) {
    try {
      const response = await cloudinary.uploader.upload(fileStr, {
        folder: 'majh-boisar-resumes',
        resource_type: 'auto',
      });
      return response.secure_url;
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      return fileStr;
    }
  }

  return fileStr;
}

