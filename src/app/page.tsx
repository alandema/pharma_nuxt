import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <p>Welcome. Choose an action:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><Link className="text-blue-600 underline" href="/patients">Manage Patients</Link></li>
        <li><Link className="text-blue-600 underline" href="/prescriptions/create">Create Prescription</Link></li>
        <li><Link className="text-blue-600 underline" href="/prescriptions/history">Prescription History</Link></li>
        <li><Link className="text-blue-600 underline" href="/cids">Manage CIDs</Link></li>
        <li><Link className="text-blue-600 underline" href="/medications">Manage Medications</Link></li>
      </ul>
    </div>
  );
}
