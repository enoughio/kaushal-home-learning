import { NextResponse, type NextRequest } from 'next/server';
import { uploadImage } from '@/helper/cloudinaryActions';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optional: dynamic folder based on form field
    const folderField = data.get('folder');
    const folder = typeof folderField === 'string' ? folderField : 'uploads';

    const uploadResult = await uploadImage(buffer, folder);

    return NextResponse.json(uploadResult);
  } catch (error: any) {
    console.error('Upload route error:', error);
    return NextResponse.json({ error: error?.message ?? String(error) }, { status: 500 });
  }
}
