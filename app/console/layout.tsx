
"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { ConsoleHeader } from "@/components/layout/ConsoleHeader";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Spinner } from "@nextui-org/react";

export default function ConsoleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [displayYear, setDisplayYear] = useState<number | null>(null);

  useEffect(() => {
    setDisplayYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (!loading) {
      const consoleRoles: Array<User['role'] | undefined> = ['cto', 'administrator', 'manager'];
      if (!user || !consoleRoles.includes(user.role)) {
        router.push('/console'); // Redirect to console login page
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner label="Loading Console..." color="warning" labelColor="warning" />
      </div>
    );
  }

  const consoleRoles: Array<User['role'] | undefined> = ['cto', 'administrator', 'manager'];
  if (!user || !consoleRoles.includes(user.role)) {
    // This will be brief as the useEffect above will redirect.
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ConsoleHeader />
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>
      <footer className="py-8 border-t bg-background">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">
            Built for Nigeria, for developers. Powered by{' '}
            <a
              href="https://seapane.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary no-underline"
            >
              Seapane
            </a>
          </p>
          <p className="text-sm">
            &copy; {displayYear !== null ? displayYear : new Date().getFullYear()} Address Data. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
