import { prisma } from '@/src/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Use Prisma ORM with include to join patient data
  const prescriptions = await prisma.prescription.findMany({
    include: {
      patient: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      date_prescribed: 'desc',
    },
    take: 50,
  });

  // Transform the data to include patient_name at the top level for backward compatibility
  const transformedPrescriptions = prescriptions.map((p) => ({
    ...p,
    patient_name: p.patient.name,
    patient: undefined, // Remove nested patient object
  }));

  return NextResponse.json(transformedPrescriptions);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.patientId || typeof body.patientId !== 'string') {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    if (!body.currentDate || typeof body.currentDate !== 'string') {
      return NextResponse.json({ error: 'Current date is required' }, { status: 400 });
    }

    // Convert date format dd/mm/YYYY -> YYYY-MM-DD
    const [d, m, y] = body.currentDate.split('/');
    const isoDate = `${y}-${m}-${d}`;

    const prescription = await prisma.prescription.create({
      data: {
        patient_id: body.patientId,
        date_prescribed: isoDate,
        json_form_info: JSON.stringify(body),
      },
    });

    return NextResponse.json(prescription, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
