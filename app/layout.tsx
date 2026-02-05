import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import { MCPProvider } from '@/lib/mcp-context';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NexTrial - AI-Powered Clinical Trial Matching',
  description:
    'Find your perfect clinical trial match with AI-powered search. Access 2,000+ trials with personalized recommendations.',
  keywords: ['clinical trials', 'medical research', 'AI matching', 'healthcare', 'cancer trials'],
  icons: {
    icon: '/logo.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full`} suppressHydrationWarning>
      <body className="antialiased h-full" suppressHydrationWarning>
        <SmoothScrollProvider>
          <MCPProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </MCPProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
