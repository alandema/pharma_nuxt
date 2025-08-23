import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/src/lib/db';
import { z } from 'zod';

const schema = z.object({ code: z.string().min(1), description: z.string().optional().nullable() });

export async function GET() {
  const db = getDb();
  const rs = await db.execute('SELECT * FROM cids ORDER BY code ASC');
  return NextResponse.json(rs.rows);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);
    const db = getDb();

    const existing = await db.execute({ sql: 'SELECT id FROM cids WHERE lower(code) = lower(?)', args: [parsed.code] });
    if (existing.rows.length) return NextResponse.json({ error: 'Código CID já cadastrado' }, { status: 400 });

    const result = await db.execute({ sql: 'INSERT INTO cids (code, description) VALUES (?, ?)', args: [parsed.code, parsed.description ?? null] });
  const id = Number(result.lastInsertRowid);
    const rs = await db.execute({ sql: 'SELECT * FROM cids WHERE id = ?', args: [id] });
    return NextResponse.json(rs.rows[0], { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
