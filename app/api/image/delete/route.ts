import { NextResponse, type NextRequest } from 'next/server';
import { deleteFile } from '@/helper/cloudinaryActions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const public_id = body?.public_id as string | undefined;

    if (!public_id) {
      return NextResponse.json({ error: 'public_id required' }, { status: 400 });
    }

    const deleteResult = await deleteFile(public_id);
    return NextResponse.json(deleteResult);
  } catch (error) {
    console.error('Delete route error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
