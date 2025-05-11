import type { Metadata } from 'next';
import { Lato } from 'next/font/google'; // Changed from Inter to Lato
import './globals.css';
// import { Toaster } from '@/components/ui/toaster'; // Removed
import { AuthProvider } from 'contexts/auth-context'; // Corrected import path
import { Providers } from './providers'; 

const lato = Lato({ 
  subsets: ['latin'],
  weight: ['400', '700'] // Added common weights
}); // Changed from Inter to Lato

export const metadata: Metadata = {
  title: 'Address Data',
  description: 'Address intelligence platform for Nigeria.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={lato.className}> {/* Changed from inter.className to lato.className */}
        <Providers> {/* This should wrap AuthProvider and include NextUIProvider */}
          <AuthProvider>
            {children}
            {/* <Toaster /> */} {/* Removed */}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}