import { v2 as cloudinary } from 'cloudinary';

// Configure cloudinary only once
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Helper to delete a file from Cloudinary given its secure URL.
 * Cloudinary URLs typically look like:
 * https://res.cloudinary.com/<cloud_name>/<resource_type>/<type>/v<version>/<public_id>.<ext>
 * Or with folders:
 * https://res.cloudinary.com/<cloud_name>/<resource_type>/upload/v<version>/<folder>/<filename>.<ext>
 */
export async function deleteCloudinaryFile(url: string | null | undefined): Promise<boolean> {
  if (!url || !url.includes('cloudinary.com')) {
    return false; // Not a Cloudinary URL
  }

  try {
    // Determine resource type (video, raw, image)
    let resourceType: 'image' | 'video' | 'raw' = 'image';
    if (url.includes('/video/')) {
      resourceType = 'video';
    } else if (url.includes('/raw/')) {
      resourceType = 'raw';
    }

    // Extract the public ID from the URL
    // URL format: https://res.cloudinary.com/cloud_name/video/upload/v123456789/folder/file.mp4
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex((part) => part === 'upload');
    
    if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
      console.error('Could not parse Cloudinary URL for deletion:', url);
      return false;
    }

    // The parts after the version (v1234567) are the public_id
    let startIndex = uploadIndex + 1;
    if (urlParts[startIndex].match(/^v\d+$/)) {
      startIndex += 1;
    }

    let publicIdWithExt = urlParts.slice(startIndex).join('/');
    
    // For raw files, the extension IS part of the public_id in Cloudinary.
    // For images/videos, the extension is NOT part of the public_id, and must be removed.
    let publicId = publicIdWithExt;
    if (resourceType !== 'raw') {
      const lastDotIndex = publicIdWithExt.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        publicId = publicIdWithExt.substring(0, lastDotIndex);
      }
    }

    // Call Cloudinary destroy
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    console.log(`Cloudinary delete result for ${publicId}:`, result);
    return result.result === 'ok' || result.result === 'not found';
  } catch (error) {
    console.error('Failed to delete from Cloudinary:', error);
    return false;
  }
}
