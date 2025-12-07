import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
}

/**
 * Compresses an image file before upload to reduce storage costs
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Compressed image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const defaultOptions = {
    maxSizeMB: 0.3, // Max 300KB - great for storage optimization
    maxWidthOrHeight: 1920, // Max dimension (maintains aspect ratio)
    useWebWorker: true, // Better performance
    fileType: 'image/webp', // Better compression than JPEG
  };

  const compressionOptions = { ...defaultOptions, ...options };

  try {
    const compressedFile = await imageCompression(file, compressionOptions);
    
    console.log(
      `Image compressed: ${(file.size / 1024).toFixed(2)}KB → ${(compressedFile.size / 1024).toFixed(2)}KB`
    );

    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    // If compression fails, return original file
    return file;
  }
}

/**
 * Checks if a file is an image
 * @param file - The file to check
 * @returns True if the file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Gets the size reduction percentage after compression
 * @param originalSize - Original file size in bytes
 * @param compressedSize - Compressed file size in bytes
 * @returns Percentage reduction
 */
export function getSizeReduction(originalSize: number, compressedSize: number): number {
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

/**
 * Formats bytes to human-readable format
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
