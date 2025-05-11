
import type { ReactNode } from 'react';
import { AppHeader } from "@/components/layout/AppHeader";
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/utils';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
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
