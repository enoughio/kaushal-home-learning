import { NextRequest, NextResponse } from 'next/server';
import { deleteImage } from '@/helper/cloudinaryActions';

export async function POST(req : NextRequest) {
  try {
    const { public_id } = await req.json();

    if (!public_id) {
      return NextResponse.json({ error: 'public_id required' }, { status: 400 });
    }

    const deleteResult = await deleteImage(public_id);
    return NextResponse.json(deleteResult);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
