import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, context: any) {
  const { params } = context as { params: { id: string } };
  const cid = await prisma.cid.findUnique({
    where: { id: params.id },
  });
  if (!cid) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(cid);
}

export async function PUT(req: Request, context: any) {
  const { params } = context;
  try {
    const body = await req.json();

    // Filter out undefined values
    const updateData: any = {};
    if (body.code !== undefined) updateData.code = body.code;
    if (body.description !== undefined) updateData.description = body.description;

    const entries = Object.entries(updateData);
    if (!entries.length) return NextResponse.json({ error: 'No fields' }, { status: 400 });

    // Check if code already exists for another CID
    if (updateData.code) {
      const exist = await prisma.cid.findFirst({
        where: {
          code: updateData.code,
          NOT: { id: params.id },
        },
        select: { id: true },
      });

      if (exist) {
        return NextResponse.json({ error: 'Código CID já cadastrado' }, { status: 400 });
      }
    }

    const cid = await prisma.cid.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(cid);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: any) {
  const { params } = context as { params: { id: string } };
  await prisma.cid.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ success: true });
}
