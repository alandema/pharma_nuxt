import { prisma } from '@/src/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, context: any) {
  const { params } = context as { params: { id: string } };
  const medication = await prisma.medication.findUnique({
    where: { id: params.id },
  });
  if (!medication) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(medication);
}

export async function PUT(req: Request, context: any) {
  const { params } = context;
  try {
    const body = await req.json();

    // Filter out undefined values
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.information !== undefined) updateData.information = body.information;

    const entries = Object.entries(updateData);
    if (!entries.length) return NextResponse.json({ error: 'No fields' }, { status: 400 });

    // Check if name already exists for another medication
    if (updateData.name) {
      const exists = await prisma.medication.findFirst({
        where: {
          name: updateData.name,
          NOT: { id: params.id },
        },
        select: { id: true },
      });

      if (exists) {
        return NextResponse.json({ error: 'Medicamento já cadastrado' }, { status: 400 });
      }
    }

    const medication = await prisma.medication.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(medication);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: any) {
  const { params } = context as { params: { id: string } };
  await prisma.medication.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ success: true });
}
