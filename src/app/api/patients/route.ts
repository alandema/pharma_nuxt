import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/src/lib/db';
import { z } from 'zod';

const patientSchema = z.object({
  name: z.string().min(1),
  rg: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  cpf: z.string().optional().nullable(),
  birth_date: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  zipcode: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  house_number: z.string().optional().nullable(),
  additional_info: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  medical_history: z.string().optional().nullable()
});

export async function GET() {
  const db = getDb();
  const rs = await db.execute(`SELECT * FROM patients ORDER BY name ASC`);
  return NextResponse.json(rs.rows);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = patientSchema.parse(body);
    const db = getDb();

    // Unique CPF check
    if (parsed.cpf && parsed.cpf !== '000.000.000-00') {
      const existing = await db.execute({
        sql: 'SELECT id FROM patients WHERE cpf = ? LIMIT 1',
        args: [parsed.cpf]
      });
      if (existing.rows.length) {
        return NextResponse.json({ error: 'CPF já cadastrado' }, { status: 400 });
      }
    }

    const cols = Object.keys(parsed).join(', ');
    const placeholders = Object.keys(parsed).map(() => '?').join(', ');
    const values = Object.values(parsed);

    const result = await db.execute({
      sql: `INSERT INTO patients (${cols}) VALUES (${placeholders})`,
      args: values
    });

  const id = Number(result.lastInsertRowid);
    const patient = await db.execute({ sql: 'SELECT * FROM patients WHERE id = ?', args: [id] });
    return NextResponse.json(patient.rows[0], { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
