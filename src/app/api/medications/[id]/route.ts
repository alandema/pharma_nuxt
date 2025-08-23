import { NextResponse } from 'next/server';
import { getDb } from '@/src/lib/db';
import { z } from 'zod';

const schema = z.object({ name: z.string().optional(), information: z.string().nullable().optional() });

export async function GET(_req: Request, context: any) {
  const { params } = context as { params: { id: string } };
  const db = getDb();
  const rs = await db.execute({ sql: 'SELECT * FROM medications WHERE id = ?', args: [params.id] });
  if (!rs.rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rs.rows[0]);
}

export async function PUT(req: Request, context: any) {
  const { params } = context;
  try {
    const body = await req.json();
    const parsed = schema.parse(body);
    const entries = Object.entries(parsed).filter(([, v]) => v !== undefined);
    if (!entries.length) return NextResponse.json({ error: 'No fields' }, { status: 400 });

    const db = getDb();
    if (parsed.name) {
      const exists = await db.execute({ sql: 'SELECT id FROM medications WHERE lower(name) = lower(?) AND id != ?', args: [parsed.name, params.id] });
      if (exists.rows.length) return NextResponse.json({ error: 'Medicamento já cadastrado' }, { status: 400 });
    }

    const setClause = entries.map(([k]) => `${k} = ?`).join(', ');
    const values = entries.map(([, v]) => v ?? null);
    await db.execute({ sql: `UPDATE medications SET ${setClause} WHERE id = ?`, args: [...values, params.id] });
    const rs = await db.execute({ sql: 'SELECT * FROM medications WHERE id = ?', args: [params.id] });
    return NextResponse.json(rs.rows[0]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: any) {
  const { params } = context as { params: { id: string } };
  const db = getDb();
  await db.execute({ sql: 'DELETE FROM medications WHERE id = ?', args: [params.id] });
  return NextResponse.json({ success: true });
}
