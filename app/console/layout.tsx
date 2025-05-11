
import type { ReactNode } from 'react';
import { ConsoleHeader } from "@/components/layout/ConsoleHeader"; // Updated import
import { checkAdmin } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';

export default async function ConsoleLayout({ // Renamed from AdminLayout
  children,
}: {
  children: ReactNode;
}) {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    // Redirect to console login if not an admin
    redirect('/console'); 
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ConsoleHeader /> {/* Use ConsoleHeader */}
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
