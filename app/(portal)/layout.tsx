
"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { AppHeader } from "@/components/layout/AppHeader";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Spinner } from "@nextui-org/react";

export default function PortalLayout({
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
    // If auth has finished loading and there's no user, redirect to login.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // While loading, show a spinner to prevent rendering children or redirecting prematurely.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner label="Loading Portal..." color="primary" labelColor="warning" />
      </div>
    );
  }

  // If not loading and there's a user, render the full layout with the page content.
  if (user) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow mx-auto px-4 py-8 w-full max-w-6xl">
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

  // If not loading and no user, the useEffect will handle the redirect. 
  // Return a spinner for the brief moment before the redirect occurs.
  return (
     <div className="flex items-center justify-center min-h-screen">
        <Spinner label="Initializing Session..." color="primary" labelColor="warning" />
      </div>
  );
}
