'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, Zap, Users, Brain, Sparkles, Globe, User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

// BentoCard Component
function BentoCard({
    title,
    description,
    gradient,
    className,
    children,
}: {
    children?: React.ReactNode;
    title: React.ReactNode;
    gradient?: string;
    description: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`relative rounded-lg overflow-hidden ${className}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
            <div className="relative flex h-full flex-col gap-2 p-6 backdrop-blur-sm border border-border/50 rounded-lg">
                <header>
                    <p className="text-lg font-bold text-foreground line-clamp-1">{title}</p>
                </header>
                <div className="flex-1 text-sm text-muted-foreground">{description}</div>
                {children}
            </div>
        </div>
    );
}

// Tech Stack Window Component
function TechStackWindow({ techStack }: { techStack: any }) {
    const [activeTab, setActiveTab] = useState('frontend');

    const tabs = [
        { id: 'frontend', label: 'Frontend', gradient: 'from-cyan-900 via-60% via-sky-600 to-indigo-600' },
        { id: 'backend', label: 'Backend', gradient: 'from-purple-900 via-60% via-purple-600 to-pink-600' },
        { id: 'ai', label: 'AI & ML', gradient: 'from-green-900 via-60% via-emerald-600 to-teal-600' },
        { id: 'dataSources', label: 'Data Sources', gradient: 'from-orange-900 via-60% via-orange-600 to-amber-600' },
        { id: 'infrastructure', label: 'Infrastructure', gradient: 'from-red-900 via-60% via-rose-600 to-red-600' },
    ];

    return (
        <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mb-20"
        >
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4 text-center">
                Technology Stack
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg max-w-3xl mx-auto">
                Built with cutting-edge technologies to deliver a fast, secure, and intelligent platform
            </p>

            {/* Window Container */}
            <div className="border border-border rounded-lg overflow-hidden shadow-2xl bg-background/50 backdrop-blur-sm">
                {/* Window Header */}
                <div className="border-b border-border bg-background/80 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 text-center text-sm text-muted-foreground font-mono">
                        tech-stack.dev
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-border bg-background/60 flex overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative px-6 py-3 text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'text-foreground bg-background'
                                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="p-6 min-h-[400px]">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Bento Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {techStack[activeTab].map((tech: any, index: number) => {
                                const currentTab = tabs.find(t => t.id === activeTab);
                                return (
                                    <BentoCard
                                        key={index}
                                        title={tech.name}
                                        description={tech.description}
                                        gradient={currentTab?.gradient}
                                        className="hover:scale-105 transition-transform duration-300 cursor-pointer group"
                                    >
                                        <div className="mt-auto pt-4 flex items-center gap-2 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                                            <div className="flex-1 h-px bg-border group-hover:bg-primary/20 transition-colors" />
                                            <span className="font-mono">v{(Math.random() * 3 + 1).toFixed(1)}</span>
                                        </div>
                                    </BentoCard>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

// Developer Card Component
function DeveloperCard() {
    return (
        <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mb-20"
        >
            <h2 className="font-serif text-4xl font-bold text-foreground mb-8 text-center">
                Meet the Developer
            </h2>

            <div className="group relative overflow-hidden rounded-2xl border border-border shadow-2xl bg-gradient-to-br from-background/80 to-background/50 backdrop-blur-sm transition-all duration-500 hover:shadow-primary/20">
                <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                    {/* Image Placeholder */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 aspect-square md:aspect-auto flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
                        <div className="relative z-10 text-center space-y-4">
                            <Image
                                src="/IMG_1264.jpg"
                                alt="Nirman Patel"
                                width={550}
                                height={300}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center space-y-6">
                        <div>
                            <h3 className="font-serif text-4xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                Nirman Patel
                            </h3>
                            <p className="text-xl text-primary font-semibold mb-4">
                                MLOps, Quantum & AI Engineer
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Passionate about leveraging cutting-edge AI and modern web technologies
                                to solve real-world challenges. Building NexTrial to democratize
                                access to clinical trials and empower patients worldwide.
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            <a
                                href="https://github.com/NirmanPatel036"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full border border-border bg-background/50 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300 group/icon"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                            <a
                                href="https://linkedin.com/in/nirmanpatel"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full border border-border bg-background/50 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300 group/icon"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                            <a
                                href="mailto:nirman0511@gmail.com"
                                className="w-12 h-12 rounded-full border border-border bg-background/50 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300 group/icon"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </a>
                        </div>

                        {/* Arrow Indicator */}
                        <a
                            href="https://nirmanhere.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer w-fit"
                        >
                            <span className="font-medium">View Projects</span>
                            <svg
                                className="w-5 h-5 transform group-hover:translate-x-2 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
                <div className="absolute bottom-4 left-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
            </div>
        </motion.div>
    );
}

export default function AboutPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const supabase = createClient();

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
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
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

        return () => subscription.unsubscribe();
    }, []);

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
        const supabase = createClient();
        await supabase.auth.signOut();
        setIsProfileMenuOpen(false);
        window.location.href = '/';
    };

    const techStack = {
        frontend: [
            { name: 'Next.js 14', description: 'React framework with App Router for optimal performance', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
            { name: 'TypeScript', description: 'Type-safe development and enhanced code quality', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
            { name: 'Tailwind CSS', description: 'Utility-first CSS framework for rapid UI development', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
            { name: 'Framer Motion', description: 'Production-ready animations and transitions', iconUrl: 'https://www.framer.com/images/favicons/favicon.png' },
            { name: 'Lenis', description: 'Smooth scroll library for enhanced user experience', iconUrl: 'https://lenis.studiofreight.com/favicon.ico' },
        ],
        backend: [
            { name: 'Modal', description: 'Serverless infrastructure for scalable compute', iconUrl: 'https://modal.com/favicon.ico' },
            { name: 'Python', description: 'Backend services and AI model integration', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
            { name: 'FastAPI', description: 'High-performance API endpoints', iconUrl: 'https://fastapi.tiangolo.com/img/icon-white.svg' },
            { name: 'Supabase', description: 'PostgreSQL database with real-time capabilities', iconUrl: 'https://supabase.com/favicon/favicon-32x32.png' },
            { name: 'Mapbox', description: 'Interactive maps for trial location visualization', iconUrl: 'https://www.mapbox.com/favicon.ico' },
        ],
        ai: [
            { name: 'Google Gemini 2.5 Flash', description: 'Advanced LLM for natural language understanding', iconUrl: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
            { name: 'ChromaDB', description: 'Vector database for semantic search', iconUrl: 'https://www.trychroma.com/chroma-logo.png' },
            { name: 'PubMedBERT', description: 'Medical domain-specific embeddings', iconUrl: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png' },
            { name: 'RAG Architecture', description: 'Retrieval Augmented Generation for accurate responses', iconUrl: 'https://cdn-icons-png.flaticon.com/512/9850/9850774.png' },
        ],
        dataSources: [
            { name: 'ClinicalTrials.gov', description: '400,000+ clinical trials from the NIH database', iconUrl: 'https://clinicaltrials.gov/favicon.ico' },
            { name: 'PubMed', description: 'Medical literature and research papers from NCBI', iconUrl: 'https://pubmed.ncbi.nlm.nih.gov/favicon.ico' },
            { name: 'RxNorm', description: 'Standardized drug naming system', iconUrl: 'https://www.nlm.nih.gov/favicon.ico' },
            { name: 'SNOMED CT', description: 'Clinical terminology standards', iconUrl: 'https://www.snomed.org/favicon.ico' },
        ],
        infrastructure: [
            { name: 'Vercel', description: 'Edge network deployment for global performance', iconUrl: 'https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico' },
            { name: 'Supabase Auth', description: 'Secure authentication with magic links', iconUrl: 'https://supabase.com/favicon/favicon-32x32.png' },
            { name: 'FHIR R4', description: 'Healthcare interoperability standards', iconUrl: 'https://www.hl7.org/favicon.ico' },
            { name: 'HIPAA Compliance', description: 'End-to-end encryption and security', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3064/3064155.png' },
        ],
    };

    return (
        <>
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50">
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

                            {/* Navigation Links */}
                            <div className="flex items-center space-x-6">
                                <Link
                                    href="/home"
                                    className="text-sm text-foreground/80 hover:text-primary transition-colors duration-200 font-medium"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/how-it-works"
                                    className="text-sm text-foreground/80 hover:text-primary transition-colors duration-200 font-medium"
                                >
                                    How It Works
                                </Link>
                                <Link
                                    href="/about"
                                    className="text-sm text-primary font-medium"
                                >
                                    About
                                </Link>
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
                                                    className="absolute right-0 mt-2 w-56 backdrop-blur-xl bg-background/95 border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                                                >
                                                    <div className="px-4 py-3 border-b border-border">
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
                                                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-white/5 transition-colors"
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
                                    <Link
                                        href="/auth/login"
                                        className="text-sm text-foreground/80 hover:text-primary transition-colors duration-200 font-medium"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="min-h-screen pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="text-center mb-20"
                    >
                        <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6">
                            About <span className="text-primary">NexTrial</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                            We're on a mission to make clinical trial discovery accessible, transparent, and
                            personalized for everyone.
                        </p>
                    </motion.div>

                    {/* Story */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-16"
                    >
                        <GlassCard>
                            <h2 className="font-serif text-3xl text-center font-bold text-foreground mb-6">Our Story</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    NexTrial was born from a simple observation: finding the right clinical trial
                                    shouldn't be this hard. Patients and their families often spend countless hours
                                    searching through complex databases, trying to understand medical jargon, and
                                    determining eligibility.
                                </p>
                                <p>
                                    We built NexTrial to change that. By combining advanced AI with comprehensive
                                    medical data sources, we've created a platform that understands your unique
                                    situation and connects you with trials that truly match your needs.
                                </p>
                                <p>
                                    Every line of code, every algorithm, and every design decision is made with
                                    one goal in mind: empowering patients with the information they need to make
                                    informed decisions about their healthcare journey.
                                </p>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Values */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="mb-16"
                    >
                        <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">
                            Our Values
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3">
                            {/* Patient-Centered - Large Card */}
                            <BentoCard
                                title="Patient-Centered"
                                description="Every decision prioritizes patient wellbeing. From intuitive design to personalized recommendations, we ensure accessibility for all."
                                gradient="from-cyan-900 via-60% via-sky-600 to-indigo-600"
                                className="sm:col-span-1 sm:row-span-2"
                            >
                                <div className="flex-1 flex flex-col justify-between mt-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs">
                                            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                                            <span className="text-muted-foreground">Easy to understand</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <div className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                                            <span className="text-muted-foreground">Personalized matches</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                            <span className="text-muted-foreground">Family-friendly</span>
                                        </div>
                                    </div>
                                    <div className="group relative flex cursor-pointer flex-col justify-end rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-4 text-2xl tracking-tight text-foreground md:text-3xl mt-6 border border-border/30">
                                        <Heart className="absolute top-3 right-3 w-8 h-8 text-primary/40 group-hover:text-primary/60 transition-colors" />
                                        <div className="font-light text-lg md:text-xl">Your Health</div>
                                        <div className="-mt-1 font-bold text-2xl md:text-3xl">Our Priority</div>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-background transition-all duration-700 group-hover:rotate-[360deg] group-hover:scale-110 mt-3">
                                            <Heart size={16} className="text-primary fill-primary" />
                                        </div>
                                        <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary opacity-50 transition-all duration-700 group-hover:opacity-100 group-hover:scale-150" />
                                    </div>
                                </div>
                            </BentoCard>

                            {/* Privacy First */}
                            <BentoCard
                                title="Privacy First"
                                description="HIPAA-compliant infrastructure with military-grade encryption protecting your sensitive health data."
                                gradient="from-purple-900 via-60% via-purple-600 to-pink-600"
                                className="group sm:col-span-1"
                            >
                                <div className="mt-auto space-y-3">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Data Encryption</span>
                                        <span className="font-mono text-primary">AES-256</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-primary/10 overflow-hidden">
                                        <div className="h-full w-full bg-primary/40 group-hover:animate-pulse" />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Compliance</span>
                                        <span className="font-mono text-primary">100%</span>
                                    </div>
                                    <div className="h-2 w-3/4 rounded-full bg-primary/10 overflow-hidden">
                                        <div className="h-full w-full bg-primary/40 group-hover:animate-pulse" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
                                    <Shield className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                                    <div className="text-right">
                                        <div className="text-xs font-mono text-primary font-bold">HIPAA</div>
                                        <div className="text-xs text-muted-foreground">Certified</div>
                                    </div>
                                </div>
                            </BentoCard>

                            {/* AI-Powered */}
                            <BentoCard
                                title="AI-Powered"
                                description="Advanced machine learning algorithms analyze thousands of trials to find your perfect match in seconds."
                                gradient="from-green-900 via-60% via-emerald-600 to-teal-600"
                                className="group sm:col-span-1"
                            >
                                <div className="mt-auto space-y-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Processing Speed</span>
                                        <span className="font-mono text-emerald-500">~2.3s</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Accuracy Rate</span>
                                        <span className="font-mono text-teal-500">94.7%</span>
                                    </div>
                                    <div className="flex w-full flex-row justify-end gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 mt-3">
                                        <Brain
                                            size={20}
                                            className="text-primary delay-150 duration-300 group-hover:animate-in group-hover:slide-in-from-right-full"
                                        />
                                        <Zap
                                            size={20}
                                            className="text-primary delay-75 duration-300 group-hover:animate-in group-hover:slide-in-from-right-full"
                                        />
                                        <Sparkles
                                            size={20}
                                            className="text-primary duration-300 group-hover:animate-in group-hover:slide-in-from-right-full"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="font-mono">Gemini 2.5 Flash Active</span>
                                    </div>
                                </div>
                            </BentoCard>

                            {/* Community Driven - Wide Card */}
                            <BentoCard
                                title="Community Driven"
                                description="Powered by comprehensive data from the NIH's extensive medical research library and clinical trial databases."
                                gradient="from-orange-900 via-60% via-orange-600 to-amber-600"
                                className="sm:col-span-2 group"
                            >
                                <div className="flex flex-col gap-4 mt-auto">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 group-hover:bg-primary/20 transition-all text-center">
                                            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                                            <div className="text-xl font-bold text-foreground">400K+</div>
                                            <div className="text-xs text-muted-foreground">Clinical Trials</div>
                                        </div>
                                        <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 group-hover:bg-primary/20 transition-all delay-75 text-center">
                                            <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
                                            <div className="text-xl font-bold text-foreground">35M+</div>
                                            <div className="text-xs text-muted-foreground">PubMed Articles</div>
                                        </div>
                                        <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 group-hover:bg-primary/20 transition-all delay-150 text-center">
                                            <Globe className="w-6 h-6 text-primary mx-auto mb-2" />
                                            <div className="text-xl font-bold text-foreground">220+</div>
                                            <div className="text-xs text-muted-foreground">Countries</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                                        <div className="text-xs text-muted-foreground">
                                            <span className="font-semibold text-foreground">Active feedback loop</span> ensures we meet real needs
                                        </div>
                                        <div className="flex -space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-cyan-500/20 border-2 border-background" />
                                            <div className="w-6 h-6 rounded-full bg-purple-500/20 border-2 border-background" />
                                            <div className="w-6 h-6 rounded-full bg-orange-500/20 border-2 border-background" />
                                        </div>
                                    </div>
                                </div>
                            </BentoCard>
                        </div>
                    </motion.div>

                    {/* Technology */}
                    <TechStackWindow techStack={techStack} />

                    {/* Developer Card */}
                    <DeveloperCard />

                    {/* Contact */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="text-center"
                    >
                        <GlassCard className="max-w-2xl mx-auto">
                            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Get in Touch</h2>
                            <p className="text-muted-foreground mb-6 text-lg">
                                Have questions or feedback? We'd love to hear from you.
                            </p>
                            <div className="space-y-3">
                                <p className="text-foreground">
                                    Email:{' '}
                                    <a href="mailto:nirman0511@gmail.com" className="text-primary hover:underline font-medium">
                                        nirman0511@gmail.com
                                    </a>
                                </p>
                                <div className="pt-6 border-t border-border">
                                    <Link href="/auth/signup">
                                        <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
                                            Get Started Today
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </main>
        </>
    );
}
