import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/src/lib/db';
import { z } from 'zod';

const createPrescriptionSchema = z.object({
  patientId: z.number(),
  currentDate: z.string(), // dd/mm/YYYY expected
  // Accept any other fields as passthrough JSON
}).passthrough();

export async function GET() {
  const db = getDb();
  const rs = await db.execute(`SELECT p.*, pat.name as patient_name FROM prescriptions p JOIN patients pat ON pat.id = p.patient_id ORDER BY date(p.date_prescribed) DESC LIMIT 50`);
  return NextResponse.json(rs.rows);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createPrescriptionSchema.parse(body);

    // Convert date format dd/mm/YYYY -> YYYY-MM-DD
    const [d, m, y] = parsed.currentDate.split('/');
    const isoDate = `${y}-${m}-${d}`; // naive trust

    const db = getDb();
    const result = await db.execute({
      sql: `INSERT INTO prescriptions (patient_id, date_prescribed, json_form_info) VALUES (?, ?, ?)` ,
      args: [parsed.patientId, isoDate, JSON.stringify(body)]
    });
  const id = Number(result.lastInsertRowid);
    const inserted = await db.execute({ sql: 'SELECT * FROM prescriptions WHERE id = ?', args: [id] });
    return NextResponse.json(inserted.rows[0], { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
