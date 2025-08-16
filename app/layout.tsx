import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { Providers } from './providers'; 
import Analytics from '@/components/analytics';

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
      <body className={lato.className}>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
