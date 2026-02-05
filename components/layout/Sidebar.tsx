'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Search,
  MessageSquare,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  FileText,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  SquareLibrary,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/lib/sidebar-context';
import { getConversations, deleteConversation, type Conversation } from '@/lib/conversations';
import { useEffect } from 'react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  items?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/home',
    icon: LayoutDashboard,
  },
  {
    label: 'Search Trials',
    href: '/search',
    icon: Search,
  },
  {
    label: 'Saved Trials',
    href: '/saved',
    icon: Bookmark,
  },
  {
    label: 'Chat Assistant',
    href: '/chat',
    icon: MessageSquare,
  },
];

const footerItems: NavItem[] = [
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isCollapsed, setIsCollapsed, isHovered, setIsHovered } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; conversationId: string | null }>({
    isOpen: false,
    conversationId: null,
  });
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setIsHovered(false);
  };

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Set isClient flag after mount to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Only load after client-side hydration

    const loadUserAndConversations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const userConversations = await getConversations(user.id);
        setConversations(userConversations);
      }
    };
    loadUserAndConversations();
  }, [supabase, isClient]);

  // Refresh conversations when navigating to chat page or when pathname changes
  useEffect(() => {
    if (!isClient || !userId) return;

    const refreshConversations = async () => {
      const userConversations = await getConversations(userId);
      setConversations(userConversations);
    };

    // Refresh when pathname changes (e.g., new conversation created)
    if (pathname.startsWith('/chat')) {
      refreshConversations();
    }
  }, [pathname, userId, isClient]);

  // Poll for new conversations every 5 seconds when on chat page
  useEffect(() => {
    if (!isClient || !userId || !pathname.startsWith('/chat')) return;

    const refreshConversations = async () => {
      const userConversations = await getConversations(userId);
      setConversations(userConversations);
    };

    const interval = setInterval(refreshConversations, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [userId, isClient, pathname]);

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Show custom confirmation dialog
    setDeleteConfirmation({ isOpen: true, conversationId });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.conversationId) return;

    const success = await deleteConversation(deleteConfirmation.conversationId);
    if (success && userId) {
      const userConversations = await getConversations(userId);
      setConversations(userConversations);
    }
  };

  const handleNewChat = () => {
    // Navigate to chat without any conversation parameter for a fresh chat
    setIsMobileOpen(false);
    // Use hard refresh to clear any existing conversation state
    window.location.href = '/chat';
  };

  const shouldShowCollapsed = isCollapsed && !isHovered;

  const NavItemComponent = ({ item, depth = 0 }: { item: NavItem; depth?: number }) => {
    const hasChildren = item.items && item.items.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const active = isActive(item.href);

    if (shouldShowCollapsed) {
      return (
        <button
          onClick={() => {
            setIsMobileOpen(false);
            window.location.href = item.href;
          }}
          className={cn(
            'flex items-center justify-center p-3 rounded-lg transition-all duration-300 ease-in-out group relative w-full',
            active
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
          title={item.label}
        >
          <item.icon className={cn('w-5 h-5 transition-all duration-300', active && 'text-primary-foreground')} />
          {item.badge && (
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-medium bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              {item.badge}
            </span>
          )}
        </button>
      );
    }

    return (
      <div>
        <button
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleExpanded(item.label);
            } else {
              setIsMobileOpen(false);
              window.location.href = item.href;
            }
          }}
          className={cn(
            'flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-300 ease-in-out group w-full',
            active
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            depth > 0 && 'ml-4'
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className={cn('w-5 h-5 transition-all duration-300', active && 'text-primary-foreground')} />
            <span className="font-medium whitespace-nowrap animate-in fade-in duration-300">{item.label}</span>
          </div>
          {item.badge && (
            <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform duration-200',
                isExpanded && 'rotate-180'
              )}
            />
          )}
        </button>
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.items?.map((subItem) => (
              <NavItemComponent key={subItem.href} item={subItem} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        onMouseEnter={() => !isCollapsed && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'fixed top-0 left-0 z-40 h-screen bg-background flex flex-col',
          'transition-all duration-500 ease-in-out',
          'rounded-r-3xl border-r border-t border-b border-border shadow-xl',
          shouldShowCollapsed ? 'w-20' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Collapse Toggle Button - Desktop only, attached to border */}
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex items-center justify-center w-6 h-10 rounded-r-lg bg-background border border-l-0 border-border hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 absolute top-6 -right-[25px] z-50 shadow-md"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-border flex items-center justify-between transition-all duration-500 ease-in-out">
          <div className="flex items-center gap-2">
            {!shouldShowCollapsed && (
              <button onClick={() => { setIsMobileOpen(false); window.location.href = '/'; }} className="flex items-center gap-2 animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1">
                  <Image src="/logo.png" alt="NexTrial" width={32} height={32} className="object-contain" />
                </div>
                <span className="text-xl font-bold whitespace-nowrap">NexTrial</span>
              </button>
            )}
            {shouldShowCollapsed && (
              <button onClick={() => { setIsMobileOpen(false); window.location.href = '/'; }}>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1">
                  <Image src="/logo.png" alt="NexTrial" width={32} height={32} className="object-contain" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2" data-lenis-prevent>
          {navItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}

          {/* Chat History Section */}
          {!shouldShowCollapsed && isClient && conversations.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border flex flex-col flex-1 min-h-0">
              <div className="flex items-center justify-between px-2 mb-2 flex-shrink-0">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Chats</h3>
                <button
                  onClick={handleNewChat}
                  className="text-xs text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-md transition-colors font-medium"
                  title="New Chat"
                >
                  + New
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent" data-lenis-prevent>
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      'group flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer',
                      pathname.includes(conversation.id)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                    onClick={() => {
                      setIsMobileOpen(false);
                      window.location.href = `/chat?conversation=${conversation.id}`;
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <SquareLibrary className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{conversation.title}</span>
                    </div>
                    <span
                      onClick={(e) => handleDeleteConversation(conversation.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded cursor-pointer"
                      title="Delete conversation"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleDeleteConversation(conversation.id, e);
                        }
                      }}
                    >
                      <X className="w-3 h-3 text-white-500 hover:bg-white/10 hover:rounded-full" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          {footerItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center w-full rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out',
              shouldShowCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
            )}
            title="Logout"
          >
            <LogOut className="w-5 h-5 transition-all duration-300" />
            {!shouldShowCollapsed && <span className="font-medium whitespace-nowrap animate-in fade-in duration-300">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, conversationId: null })}
        onConfirm={confirmDelete}
        title="Delete conversation"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
      />
    </>
  );
}
