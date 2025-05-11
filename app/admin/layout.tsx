import type { ReactNode } from 'react';
import { AdminHeader } from "@/components/layout/AdminHeader";
import { checkAdmin } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    redirect('/admin/signin');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="py-6 border-t bg-background text-center text-muted-foreground text-sm">
        Address Data - Admin Console &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
