
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
    redirect('/admin/login');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="py-6 border-t bg-background text-center text-muted-foreground text-sm">
        <p>
            Built for Nigeria, for developers. Powered by{' '}
            <a
              href="https://searpane.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              Seapane
            </a>
          </p>
      </footer>
    </div>
  );
}
