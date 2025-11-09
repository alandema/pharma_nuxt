import { prisma } from '@/src/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const cids = await prisma.cid.findMany({
    orderBy: { code: 'asc' },
  });
  return NextResponse.json(cids);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.code || typeof body.code !== 'string' || body.code.trim().length === 0) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // Check if CID code already exists (case-insensitive)
    const existing = await prisma.cid.findFirst({
      where: {
        code: body.code,
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({ error: 'Código CID já cadastrado' }, { status: 400 });
    }

    const cid = await prisma.cid.create({
      data: {
        code: body.code,
        description: body.description ?? null,
      },
    });

    return NextResponse.json(cid, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
