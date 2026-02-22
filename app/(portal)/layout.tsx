
"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Topbar } from "@/components/layout/portal/topbar";
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Spinner } from "@nextui-org/react";
import Link from 'next/link';

export default function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [displayYear, setDisplayYear] = useState<number | null>(null);

  useEffect(() => {
    setDisplayYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner label="Loading Portal..." color="primary" labelColor="warning" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-grow mx-auto px-4 py-8 w-full max-w-6xl">
          {children}
        </main>
        <footer className="py-8 border-t bg-background">
          <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
            <p className="mb-2">
              Built for Nigeria, for developers. Powered by{' '}
              <Link
                href="https://seapane.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary no-underline"
              >
                Seapane
              </Link>
            </p>
            <p className="text-sm">
              &copy; {displayYear !== null ? displayYear : new Date().getFullYear()} AddressData. All Rights Reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner label="Initializing Session..." color="primary" labelColor="warning" />
    </div>
  );
}
