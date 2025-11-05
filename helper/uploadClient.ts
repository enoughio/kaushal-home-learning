export async function uploadFileClient(file: File | Blob, folder = 'uploads'): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch('/api/image/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Upload failed');
  return await res.json();
}

export async function deleteFileClient(public_id: string): Promise<any> {
  const res = await fetch('/api/image/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ public_id }),
  });

  if (!res.ok) throw new Error('Delete failed');
  return await res.json();
}



// ---------example usage -------------
// 'use client';
// import { useState } from 'react';
// import { uploadFileClient, deleteFileClient } from '@/utils/uploadClient';

// export default function ImageUploader() {
//   const [file, setFile] = useState(null);
//   const [image, setImage] = useState(null);

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return;

//     const res = await uploadFileClient(file, 'profile_pics');
//     setImage(res);
//   };

//   const handleDelete = async () => {
//     if (!image?.public_id) return;
//     await deleteFileClient(image.public_id);
//     setImage(null);
//   };

//   return (
//     <div className="p-6">
//       <form onSubmit={handleUpload}>
//         <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//         <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded ml-2">
//           Upload
//         </button>
//       </form>

//       {image && (
//         <div className="mt-4">
//           <img src={image.url} alt="Uploaded" width={250} className="rounded" />
//           <button
//             onClick={handleDelete}
//             className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
//           >
//             Delete
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


// -------------

