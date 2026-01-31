import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, context: any) {
  const { params } = context as { params: { id: string } };
  const prescription = await prisma.prescription.findUnique({
    where: { id: params.id },
    include: { patient: true },
  });
  if (!prescription) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(prescription);
}

export async function DELETE(_req: Request, context: any) {
  const { params } = context as { params: { id: string } };
  await prisma.prescription.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ success: true });
}
