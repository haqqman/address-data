
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
    // Redirect to admin login if not an admin, which is different from user login
    redirect('/admin/login'); 
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="py-8 border-t bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">
            Built for Nigeria, for developers. Powered by{' '}
            <a
              href="https://searpane.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 no-underline"
            >
              Seapane
            </a>
          </p>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Address Data. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
