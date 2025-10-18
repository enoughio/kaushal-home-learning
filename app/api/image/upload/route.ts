import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/helper/cloudinaryActions'; 

export async function POST(req : NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optional: dynamic folder based on query param or metadata
    const folder = data.get('folder') || 'uploads';

    const uploadResult = await uploadImage(buffer, folder);

    return NextResponse.json(uploadResult);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
