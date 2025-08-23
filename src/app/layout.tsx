import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Medical Prescription App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="p-4 border-b bg-white shadow-sm"><h1 className="font-semibold">Medical Prescription App</h1></header>
        <main className="max-w-5xl mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
