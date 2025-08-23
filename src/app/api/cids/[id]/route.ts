import { NextResponse } from 'next/server';
import { getDb } from '@/src/lib/db';
import { z } from 'zod';

const schema = z.object({ code: z.string().optional(), description: z.string().nullable().optional() });

export async function GET(_req: Request, context: any) {
  const { params } = context as { params: { id: string } };
  const db = getDb();
  const rs = await db.execute({ sql: 'SELECT * FROM cids WHERE id = ?', args: [params.id] });
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
    if (parsed.code) {
      const exist = await db.execute({ sql: 'SELECT id FROM cids WHERE lower(code) = lower(?) AND id != ?', args: [parsed.code, params.id] });
      if (exist.rows.length) return NextResponse.json({ error: 'Código CID já cadastrado' }, { status: 400 });
    }

    const setClause = entries.map(([k]) => `${k} = ?`).join(', ');
    const values = entries.map(([, v]) => v ?? null);
    await db.execute({ sql: `UPDATE cids SET ${setClause} WHERE id = ?`, args: [...values, params.id] });
    const rs = await db.execute({ sql: 'SELECT * FROM cids WHERE id = ?', args: [params.id] });
    return NextResponse.json(rs.rows[0]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: any) {
  const { params } = context as { params: { id: string } };
  const db = getDb();
  await db.execute({ sql: 'DELETE FROM cids WHERE id = ?', args: [params.id] });
  return NextResponse.json({ success: true });
}
