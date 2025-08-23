import { migrate, getDb } from '@/src/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PatientsPage() {
  await migrate();
  const db = getDb();
  const rs = await db.execute('SELECT * FROM patients ORDER BY name ASC');
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Patients</h2>
        <Link href="/" className="text-sm text-blue-600 underline">Home</Link>
      </div>
      <pre className="bg-white p-4 rounded border max-h-96 overflow-auto text-sm">{JSON.stringify(rs.rows, null, 2)}</pre>
    </div>
  );
}