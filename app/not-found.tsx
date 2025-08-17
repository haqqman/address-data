
"use client";

import Link from 'next/link';
import { Button as NextUIButton } from "@nextui-org/react";
import { SearchX } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow flex items-center justify-center bg-primary/5">
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center rounded-full bg-danger-100 p-4 mb-6">
            <SearchX className="h-16 w-16 text-danger" />
          </div>
          <h1 className="text-4xl font-bold text-primary tracking-tight">404 - Page Not Found</h1>
          <p className="mt-4 text-lg text-foreground-600">
            Sorry, the page you are looking for does not exist or you do not have permission to view it.
          </p>
          <p className="text-md text-foreground-500 mt-2">
            It might have been moved or deleted.
          </p>
          <NextUIButton
            as={Link}
            href="/"
            color="warning"
            className="mt-8 text-primary shadow-lg hover:-translate-y-px"
            size="lg"
          >
            Go back to Homepage
          </NextUIButton>
        </div>
      </main>
    </div>
  );
}
