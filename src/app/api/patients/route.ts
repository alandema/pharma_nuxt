import { prisma } from '@/src/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const patients = await prisma.patient.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(patients);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Unique CPF check
    if (body.cpf && body.cpf !== '000.000.000-00') {
      const existing = await prisma.patient.findUnique({
        where: { cpf: body.cpf },
        select: { id: true },
      });
      if (existing) {
        return NextResponse.json({ error: 'CPF já cadastrado' }, { status: 400 });
      }
    }

    const patient = await prisma.patient.create({
      data: {
        name: body.name,
        rg: body.rg ?? null,
        gender: body.gender ?? null,
        cpf: body.cpf ?? null,
        birth_date: body.birth_date ?? null,
        phone: body.phone ?? null,
        zipcode: body.zipcode ?? null,
        street: body.street ?? null,
        district: body.district ?? null,
        house_number: body.house_number ?? null,
        additional_info: body.additional_info ?? null,
        country: body.country ?? null,
        state: body.state ?? null,
        city: body.city ?? null,
        medical_history: body.medical_history ?? null,
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
