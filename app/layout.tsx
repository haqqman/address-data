import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { Providers } from './providers'; 

const lato = Lato({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

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
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
