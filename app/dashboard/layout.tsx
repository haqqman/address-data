"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { AppHeader } from "@/components/layout/AppHeader";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Spinner } from "@nextui-org/react";

export default function DashboardLayout({
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
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner label="Loading Dashboard..." color="primary" labelColor="warning" />
      </div>
    );
  }

  if (!user) {
    // This will be brief as the useEffect above will redirect.
    // Or, you can show a message or a simpler layout here if preferred.
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Redirecting to login...</p>
        </div>
    );
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

