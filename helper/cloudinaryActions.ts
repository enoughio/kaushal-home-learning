import cloudinary from '@/lib/cloudinary';

//  Upload Image
export const uploadImage = async (fileBuffer , folder = 'uploads') => {
  try {
    
    cloudinary.uploader
        .upload_stream({folder})

  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Upload failed');
  }
};

// Delete Image
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    throw new Error('Delete failed');
  }
};
