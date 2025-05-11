import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // Removed as it's causing an error
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

// const geistSans = GeistSans; // No need to reassign if using directly
// const geistMono = GeistMono; // Removed as it's causing an error

export const metadata: Metadata = {
  title: 'Address Data Sandbox',
  description: 'Address intelligence platform for Nigeria.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}> {/* Use GeistSans.variable directly */}
      <body className="antialiased font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
