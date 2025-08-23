import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/src/lib/db';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(1), information: z.string().optional().nullable() });

export async function GET() {
  const db = getDb();
  const rs = await db.execute('SELECT * FROM medications ORDER BY name ASC');
  return NextResponse.json(rs.rows);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);
    const db = getDb();
    const exist = await db.execute({ sql: 'SELECT id FROM medications WHERE lower(name) = lower(?)', args: [parsed.name] });
    if (exist.rows.length) return NextResponse.json({ error: 'Medicamento já cadastrado' }, { status: 400 });
    const result = await db.execute({ sql: 'INSERT INTO medications (name, information) VALUES (?, ?)', args: [parsed.name, parsed.information ?? null] });
  const id = Number(result.lastInsertRowid);
    const rs = await db.execute({ sql: 'SELECT * FROM medications WHERE id = ?', args: [id] });
    return NextResponse.json(rs.rows[0], { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
