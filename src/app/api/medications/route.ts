import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const medications = await prisma.medication.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(medications);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Check if medication already exists
    const exist = await prisma.medication.findFirst({
      where: {
        name: body.name,
      },
      select: { id: true },
    });

    if (exist) {
      return NextResponse.json({ error: 'Medicamento já cadastrado' }, { status: 400 });
    }

    const medication = await prisma.medication.create({
      data: {
        name: body.name,
        information: body.information ?? null,
      },
    });

    return NextResponse.json(medication, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
