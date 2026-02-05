'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide nav and footer for authenticated routes
  const isAuthenticatedRoute = pathname.startsWith('/home') || 
                                pathname.startsWith('/search') || 
                                pathname.startsWith('/chat') || 
                                pathname.startsWith('/saved') ||
                                pathname.startsWith('/settings');

  if (isAuthenticatedRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
}
