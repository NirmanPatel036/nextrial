'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useLenis } from 'lenis/react';

interface PatientProfile {
    id?: string;
    user_id?: string;
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    diagnosis?: string;
    stage?: string;
    current_treatment?: string;
    allergies?: string;
    created_at?: string;
    updated_at?: string;
}

const Navigation = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [profile, setProfile] = useState<PatientProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const lenis = useLenis();
    const supabase = createClient();
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Get initial session
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                // Fetch user profile
                const { data: profileData } = await supabase
                    .from('patient_profiles')
                    .select('first_name, last_name')
                    .eq('user_id', user.id)
                    .single();

                setProfile(profileData);
            }
            setLoading(false);
        };

        getUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);

            if (session?.user) {
                const { data: profileData } = await supabase
                    .from('patient_profiles')
                    .select('first_name, last_name')
                    .eq('user_id', session.user.id)
                    .single();

                setProfile(profileData);
            } else {
                setProfile(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    // Click outside to close profile menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        if (isProfileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileMenuOpen]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setIsProfileMenuOpen(false);
        window.location.href = '/';
    };

    const navLinks = [
        { href: '/#how-it-works', label: 'How it works' },
        { href: '/#search', label: 'Search Trials' },
        { href: '/#integrations', label: 'Integrations' },
        { href: '/#statistics', label: 'Numbers' },
    ];

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('/#')) {
            e.preventDefault();
            const targetId = href.replace('/', '');

            // Mobile menu close
            setIsMobileMenuOpen(false);

            // Using Lenis for smooth scroll
            if (lenis) {
                lenis.scrollTo(targetId, { offset: -100 });
            } else {
                // Fallback if Lenis isn't ready
                const element = document.querySelector(targetId);
                element?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            {/* Container with border/outline effect */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="border border-border/50 rounded-full my-2 px-4 py-1 glass shadow-lg">
                    <div className="flex items-center justify-between h-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                                <Image
                                    src="/logo.png"
                                    alt="NexTrial Logo"
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="font-serif text-base font-bold text-foreground">
                                NexTrial
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => handleScroll(e, link.href)}
                                    className="text-sm text-foreground/80 hover:text-primary transition-colors duration-200 font-medium cursor-pointer"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* Desktop CTA Buttons / User Profile */}
                        <div className="hidden md:flex items-center space-x-2">
                            {loading ? (
                                <div className="h-7 w-20 bg-white/10 rounded-md animate-pulse" />
                            ) : user ? (
                                <div className="relative" ref={profileMenuRef}>
                                    <button
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-medium text-foreground">
                                            {profile?.first_name || user.email?.split('@')[0]}
                                        </span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {isProfileMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute right-0 mt-2 w-56 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-2xl overflow-hidden"
                                            >
                                                <div className="px-4 py-3 border-b border-white/10">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {profile?.first_name && profile?.last_name
                                                            ? `${profile.first_name} ${profile.last_name}`
                                                            : 'User Profile'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <div className="py-2">
                                                    <button
                                                        onClick={() => {
                                                            setIsProfileMenuOpen(false);
                                                            window.location.href = '/home';
                                                        }}
                                                        className="flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-white/5 transition-colors w-full"
                                                    >
                                                        <LayoutDashboard className="w-4 h-4" />
                                                        <span>Home</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsProfileMenuOpen(false);
                                                            window.location.href = '/settings';
                                                        }}
                                                        className="flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-white/5 transition-colors w-full"
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                        <span>Settings</span>
                                                    </button>
                                                    <button
                                                        onClick={handleSignOut}
                                                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-destructive hover:bg-white/5 transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        <span>Sign Out</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <>
                                    <Button variant="ghost" size="sm" asChild className="h-7 px-3 text-xs">
                                        <Link href="/auth/login">Login</Link>
                                    </Button>
                                    <Button size="sm" asChild className="h-7 px-3 text-xs">
                                        <Link href="/auth/signup">Get Started</Link>
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-1 rounded-lg hover:bg-primary/10 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5 text-foreground" />
                            ) : (
                                <Menu className="w-5 h-5 text-foreground" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden py-4 border-t border-border"
                        >
                            <div className="flex flex-col space-y-4">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium py-2 cursor-pointer"
                                        onClick={(e) => handleScroll(e, link.href)}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                                    {user ? (
                                        <>
                                            <div className="px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                                                <p className="text-sm font-semibold text-foreground">
                                                    {profile?.first_name && profile?.last_name
                                                        ? `${profile.first_name} ${profile.last_name}`
                                                        : 'User Profile'}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <Button variant="ghost" asChild>
                                                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                                    Dashboard
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" asChild>
                                                <Link href="/dashboard/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Settings
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={handleSignOut}
                                                className="text-destructive hover:text-destructive/90"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Sign Out
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="ghost" asChild>
                                                <Link href="/auth/login">Login</Link>
                                            </Button>
                                            <Button asChild>
                                                <Link href="/auth/signup">Get Started</Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
