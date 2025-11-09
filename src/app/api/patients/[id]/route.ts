import { prisma } from '@/src/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, context: any) {
  const { params } = context as { params: { id: string } };
  const patient = await prisma.patient.findUnique({
    where: { id: params.id },
  });
  if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  return NextResponse.json(patient);
}

export async function PUT(req: Request, context: any) {
  const { params } = context;
  try {
    const body = await req.json();

    // Filter out undefined values
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.rg !== undefined) updateData.rg = body.rg;
    if (body.gender !== undefined) updateData.gender = body.gender;
    if (body.cpf !== undefined) updateData.cpf = body.cpf;
    if (body.birth_date !== undefined) updateData.birth_date = body.birth_date;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.zipcode !== undefined) updateData.zipcode = body.zipcode;
    if (body.street !== undefined) updateData.street = body.street;
    if (body.district !== undefined) updateData.district = body.district;
    if (body.house_number !== undefined) updateData.house_number = body.house_number;
    if (body.additional_info !== undefined) updateData.additional_info = body.additional_info;
    if (body.country !== undefined) updateData.country = body.country;
    if (body.state !== undefined) updateData.state = body.state;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.medical_history !== undefined) updateData.medical_history = body.medical_history;

    const entries = Object.entries(updateData);
    if (!entries.length) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

    // Unique CPF check
    if (updateData.cpf && updateData.cpf !== '000.000.000-00') {
      const exists = await prisma.patient.findFirst({
        where: {
          cpf: updateData.cpf,
          NOT: { id: params.id },
        },
        select: { id: true },
      });
      if (exists) return NextResponse.json({ error: 'CPF já cadastrado' }, { status: 400 });
    }

    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(patient);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: any) {
  const { params } = context as { params: { id: string } };
  await prisma.patient.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ success: true });
}
