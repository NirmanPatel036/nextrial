'use client';

import Sidebar from '@/components/layout/Sidebar';
import { SidebarProvider, useSidebar } from '@/lib/sidebar-context';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed, isHovered } = useSidebar();
  const shouldShowCollapsed = isCollapsed && !isHovered;

  return (
    <>
      <Sidebar />
      <main 
        className="flex-1 transition-all duration-500 w-full"
        style={{
          marginLeft: shouldShowCollapsed ? '5rem' : '16rem', // 80px or 256px
        }}
      >
        {children}
      </main>
    </>
  );
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <LayoutContent>{children}</LayoutContent>
      </div>
    </SidebarProvider>
  );
}
