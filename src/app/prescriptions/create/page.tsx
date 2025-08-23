import { migrate, getDb } from '@/src/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CreatePrescriptionPage() {
  await migrate();
  const db = getDb();
  const patients = await db.execute('SELECT id, name FROM patients ORDER BY name ASC');
  const medications = await db.execute('SELECT id, name FROM medications ORDER BY name ASC');
  const cids = await db.execute('SELECT id, code FROM cids ORDER BY code ASC');
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Create Prescription</h2>
        <Link href="/" className="text-sm text-blue-600 underline">Home</Link>
      </div>
      <p className="text-sm text-gray-600">(UI form not yet implemented)</p>
      <pre className="bg-white p-4 rounded border max-h-72 overflow-auto text-xs">Patients: {JSON.stringify(patients.rows, null, 2)}
Medications: {JSON.stringify(medications.rows, null, 2)}
CIDs: {JSON.stringify(cids.rows, null, 2)}</pre>
    </div>
  );
}