
"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { ConsoleHeader } from "@/components/layout/ConsoleHeader";
import { useAuth } from '@/contexts/auth-context';
import { Spinner } from "@nextui-org/react";

export default function ConsoleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { loading } = useAuth();
  const [displayYear, setDisplayYear] = useState<number | null>(null);

  useEffect(() => {
    setDisplayYear(new Date().getFullYear());
  }, []);

  // The redirection logic has been moved to middleware.ts to avoid redirect loops
  // and to secure all console routes consistently on the server-side.

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner label="Loading Console..." color="warning" labelColor="warning" />
      </div>
    );
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
