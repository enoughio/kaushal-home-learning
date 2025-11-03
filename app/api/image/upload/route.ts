import { NextResponse, type NextRequest } from 'next/server';
import { uploadFile } from '@/helper/cloudinaryActions';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const folderField = data.get('folder');
    const folder = typeof folderField === 'string' ? folderField : 'uploads';

    const uploadResult = await uploadFile(file, folder);

    return NextResponse.json(uploadResult);
  } catch (error : unknown) {
    console.error('Upload route error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
