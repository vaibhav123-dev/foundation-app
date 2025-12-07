// Cloudinary Upload Service

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload an image to Cloudinary
 * @param file - The file to upload
 * @param folder - The folder name in Cloudinary (e.g., 'members', 'events', 'founders')
 * @returns The secure URL of the uploaded image
 */
export const uploadImageToCloudinary = async (
  file: File,
  folder: string
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `foundation/${folder}`); // Organize files in folders

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url; // Return the secure HTTPS URL
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete an image from Cloudinary
 * @param imageURL - The URL of the image to delete
 * @returns Promise<void>
 * Note: Deleting images from Cloudinary requires authentication.
 * For client-side deletion, you'll need to implement a backend endpoint
 * or use Cloudinary's auto-deletion features.
 */
export const deleteImageFromCloudinary = async (imageURL: string): Promise<void> => {
  try {
    // Extract public_id from the URL
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{version}/{public_id}.{format}
    const urlParts = imageURL.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) {
      console.warn('Invalid Cloudinary URL format');
      return;
    }

    // Get everything after 'upload/' and before the file extension
    const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
    const publicIdWithExtension = pathAfterUpload.split('/').slice(-1)[0];
    const publicId = publicIdWithExtension.split('.')[0];

    console.log('Image deletion from Cloudinary:', publicId);
    
    // Note: Client-side deletion is not recommended for security reasons.
    // Implement a backend endpoint to handle deletion securely.
    // For now, we'll just log the deletion attempt.
    console.warn(
      'Client-side deletion is disabled. Implement a backend endpoint for secure deletion.'
    );
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

/**
 * Extract public ID from Cloudinary URL
 * This can be useful for various operations
 */
export const extractPublicId = (imageURL: string): string | null => {
  try {
    const urlParts = imageURL.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) {
      return null;
    }

    const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
    const publicIdWithExtension = pathAfterUpload.split('/').slice(-1)[0];
    const publicId = publicIdWithExtension.split('.')[0];

    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};
