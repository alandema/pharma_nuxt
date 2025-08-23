import { NextResponse } from 'next/server';
import { getDb } from '@/src/lib/db';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().optional(),
  rg: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
  birth_date: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  zipcode: z.string().nullable().optional(),
  street: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  house_number: z.string().nullable().optional(),
  additional_info: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  medical_history: z.string().nullable().optional()
});

export async function GET(_req: Request, context: any) {
  const { params } = context as { params: { id: string } };
  const db = getDb();
  const rs = await db.execute({ sql: 'SELECT * FROM patients WHERE id = ?', args: [params.id] });
  if (!rs.rows.length) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  return NextResponse.json(rs.rows[0]);
}

export async function PUT(req: Request, context: any) {
  const { params } = context;
  try {
    const body = await req.json();
    const parsed = updateSchema.parse(body);
    const db = getDb();

    if (parsed.cpf && parsed.cpf !== '000.000.000-00') {
      const exists = await db.execute({ sql: 'SELECT id FROM patients WHERE cpf = ? AND id != ?', args: [parsed.cpf, params.id] });
      if (exists.rows.length) return NextResponse.json({ error: 'CPF já cadastrado' }, { status: 400 });
    }

    const entries = Object.entries(parsed).filter(([, v]) => v !== undefined);
    if (!entries.length) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

    const setClause = entries.map(([k]) => `${k} = ?`).join(', ');
    const values = entries.map(([, v]) => v);

    await db.execute({ sql: `UPDATE patients SET ${setClause} WHERE id = ?`, args: [...values, params.id] });
    const rs = await db.execute({ sql: 'SELECT * FROM patients WHERE id = ?', args: [params.id] });
    return NextResponse.json(rs.rows[0]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: any) {
  const { params } = context as { params: { id: string } };
  const db = getDb();
  await db.execute({ sql: 'DELETE FROM patients WHERE id = ?', args: [params.id] });
  return NextResponse.json({ success: true });
}
