import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar userRole={user.role} />

      {/* Main Right Content Section */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
