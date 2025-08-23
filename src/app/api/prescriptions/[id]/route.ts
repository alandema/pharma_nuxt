import { NextResponse } from 'next/server';
import { getDb } from '@/src/lib/db';

export async function GET(_req: Request, context: any) {
  const { params } = context as { params: { id: string } };
  const db = getDb();
  const rs = await db.execute({ sql: 'SELECT * FROM prescriptions WHERE id = ?', args: [params.id] });
  if (!rs.rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rs.rows[0]);
}

export async function DELETE(_req: Request, context: any) {
  const { params } = context as { params: { id: string } };
  const db = getDb();
  await db.execute({ sql: 'DELETE FROM prescriptions WHERE id = ?', args: [params.id] });
  return NextResponse.json({ success: true });
}
