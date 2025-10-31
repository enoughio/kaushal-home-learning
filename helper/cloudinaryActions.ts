import cloudinary from '@/lib/cloudinary';

interface UploadResult {
  url: string;
  public_id: string;
}

// Upload Image
export const uploadFile = async (file: File, folder = 'uploads'): Promise<UploadResult> => {
  
   const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  try {
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder }, (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    return {
      url: result.secure_url,
      public_id: result.public_id, // useful for deleting later
    };
  } catch (error: any) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Upload failed');
  }
};

// Delete Image
export const deleteFile = async (publicId: string): Promise<any> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error: any) {
    console.error('Cloudinary Delete Error:', error);
    throw new Error('Delete failed');
  }
};
