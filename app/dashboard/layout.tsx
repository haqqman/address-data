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
    redirect('/signin');
  }
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
       <footer className="py-6 border-t bg-background text-center text-muted-foreground text-sm">
        Address Data &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
