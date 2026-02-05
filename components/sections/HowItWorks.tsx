'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Step {
    id: string;
    title: string;
    description: string;
    image: string;
}

const HowItWorks = () => {
    const [activeStep, setActiveStep] = useState(0);
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);

    const steps: Step[] = [
        {
            id: 'share-story',
            title: 'Share Your Story',
            description:
                'Create your personalized profile by sharing your medical history, diagnosis, and treatment preferences. Our HIPAA-compliant platform ensures your data remains secure and confidential throughout the matching process.',
            image: '/mockups/share-story.png',
        },
        {
            id: 'ai-matching',
            title: 'AI-Powered Matching',
            description:
                'Our advanced RAG (Retrieval-Augmented Generation) system analyzes over 2,000 active clinical trials using your unique profile. The AI evaluates eligibility criteria, treatment protocols, and location preferences to find your perfect matches.',
            image: '/mockups/ai-matching.png',
        },
        {
            id: 'review-matches',
            title: 'Review Personalized Matches',
            description:
                'Browse through your curated list of clinical trial matches, ranked by compatibility score. Each trial includes detailed eligibility criteria, phase information, location details, and expected outcomes to help you make informed decisions.',
            image: '/mockups/review-matches.png',
        },
        {
            id: 'interactive-map',
            title: 'Interactive Trial Mapping',
            description:
                'Visualize clinical trials globally with our interactive Mapbox integration. Filter by location, view clusters of opportunities, and explore trial sites near you with precision mapping technology.',
            image: '/mockups/mapbox-view.png',
        },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const triggerPoint = 320;
            let newActiveStep = 0;

            sectionRefs.current.forEach((section, index) => {
                if (section) {
                    const rect = section.getBoundingClientRect();
                    // When a card's top edge crosses or is above the trigger point, it becomes active
                    if (rect.top <= triggerPoint) {
                        newActiveStep = index;
                    }
                }
            });

            setActiveStep(newActiveStep);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <section className="relative bg-background scroll-smooth">
            {/* Section Header - Sticky */}
            <div className="sticky top-0 z-20 bg-background pb-8 pt-20">
                <div className="text-center">
                    <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                        How It Works
                    </span>
                    <h2 className="font-serif mt-4 mb-6 text-4xl font-bold text-foreground md:text-5xl">
                        Four simple steps to find your match
                    </h2>
                    <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                        Our AI-powered platform makes clinical trial discovery effortless and
                        personalized.
                    </p>
                </div>
            </div>

            {/* Sticky Scroll Container */}
            <div className="relative flex">
                {/* Left Navigation - Sticky */}
                <div className="hidden lg:block lg:w-[35%]" style={{ minHeight: `${(steps.length + 1) * 100}vh` }}>
                    <div className="sticky top-80 ml-auto mr-12 w-64 pt-10">
                        <nav className="space-y-6">
                            {steps.map((step, index) => (
                                <button
                                    key={step.id}
                                    onClick={() => {
                                        sectionRefs.current[index]?.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'center',
                                        });
                                    }}
                                    className={`group flex w-full items-start gap-4 text-left transition-all duration-300 ${activeStep === index
                                        ? 'opacity-100'
                                        : 'opacity-40 hover:opacity-70'
                                        }`}
                                >
                                    <div
                                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${activeStep === index
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-muted-foreground text-muted-foreground'
                                            }`}
                                    >
                                        <span className="text-sm font-bold">{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3
                                            className={`font-serif text-lg font-semibold transition-colors duration-300 ${activeStep === index
                                                ? 'text-foreground'
                                                : 'text-muted-foreground'
                                                }`}
                                        >
                                            {step.title}
                                        </h3>
                                    </div>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Right Content - Scrollable Cards */}
                <div className="w-full lg:w-[65%]">
                    {steps.map((step, index) => (
                        <section
                            key={step.id}
                            ref={(el) => {
                                sectionRefs.current[index] = el;
                            }}
                            className="sticky top-80 flex min-h-screen items-start justify-start pl-12 py-10"
                        >
                            <div className="w-full max-w-3xl px-4">
                                {/* Mobile Navigation Number */}
                                <div className="mb-6 flex items-center gap-3 lg:hidden">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary text-primary-foreground">
                                        <span className="font-bold">{index + 1}</span>
                                    </div>
                                    <h3 className="font-serif text-2xl font-bold text-foreground">
                                        {step.title}
                                    </h3>
                                </div>

                                {/* Card Content */}
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-100px' }}
                                    transition={{ duration: 0.6 }}
                                    className="overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 p-[2px]"
                                >
                                    <div className="overflow-hidden rounded-2xl bg-zinc-900">
                                        {/* Window Controls Header */}
                                        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/95 px-4 py-3">
                                            <div className="flex gap-2">
                                                <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                                                <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                                                <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                                            </div>
                                            <div className="font-mono text-sm text-zinc-400">
                                                {step.title}
                                            </div>
                                            <div className="w-16"></div>
                                        </div>

                                        {/* Terminal-style Content */}
                                        <div className="p-6 font-mono text-sm">
                                            {/* Step-specific content */}
                                            {index === 0 && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-green-500/20">
                                                            <span className="text-xs text-green-400">✓</span>
                                                        </div>
                                                        <span className="text-green-400">Medical History</span>
                                                        <span className="ml-auto text-zinc-500">Complete</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-green-500/20">
                                                            <span className="text-xs text-green-400">✓</span>
                                                        </div>
                                                        <span className="text-green-400">Diagnosis Details</span>
                                                        <span className="ml-auto text-zinc-500">Verified</span>
                                                    </div>
                                                    <div className="mt-4 rounded-lg bg-zinc-800/50 p-4">
                                                        <div className="text-zinc-400">Treatment Preferences</div>
                                                        <div className="mt-2 space-y-1 text-zinc-500">
                                                            <div>• Location: Within 50 miles</div>
                                                            <div>• Phase: II, III</div>
                                                            <div>• Duration: 3-6 months</div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 text-xs text-zinc-600">
                                                        🔒 HIPAA-compliant encryption enabled
                                                    </div>
                                                </div>
                                            )}
                                            {index === 1 && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                                                        <span className="text-green-400">Analyzing profile...</span>
                                                        <span className="ml-auto text-zinc-500">2.1s</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-green-500/20">
                                                            <span className="text-xs text-green-400">✓</span>
                                                        </div>
                                                        <span className="text-green-400">RAG System Active</span>
                                                        <span className="ml-auto text-zinc-500">Ready</span>
                                                    </div>
                                                    <div className="mt-4 rounded-lg bg-zinc-800/50 p-4">
                                                        <div className="text-zinc-400">Database Query</div>
                                                        <div className="mt-2 space-y-1 font-mono text-xs text-zinc-500">
                                                            <div>→ Searching 2,847 active trials</div>
                                                            <div>→ Matching eligibility criteria</div>
                                                            <div>→ Evaluating location proximity</div>
                                                            <div>→ Ranking by compatibility</div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
                                                        <span>●</span>
                                                        <span>AI matching complete</span>
                                                    </div>
                                                </div>
                                            )}
                                            {index === 2 && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-green-500/20">
                                                            <span className="text-xs text-green-400">12</span>
                                                        </div>
                                                        <span className="text-green-400">Matches Found</span>
                                                        <span className="ml-auto text-zinc-500">Sorted by score</span>
                                                    </div>
                                                    <div className="mt-4 space-y-2">
                                                        <div className="rounded-lg bg-zinc-800/50 p-3">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-green-400">Trial #NCT04892</span>
                                                                <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-400">98% Match</span>
                                                            </div>
                                                            <div className="mt-1 text-xs text-zinc-500">Phase III • 15 miles • 6 months</div>
                                                        </div>
                                                        <div className="rounded-lg bg-zinc-800/50 p-3">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-green-400">Trial #NCT05123</span>
                                                                <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-400">94% Match</span>
                                                            </div>
                                                            <div className="mt-1 text-xs text-zinc-500">Phase II • 22 miles • 4 months</div>
                                                        </div>
                                                        <div className="rounded-lg bg-zinc-800/50 p-3">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-green-400">Trial #NCT04756</span>
                                                                <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-400">91% Match</span>
                                                            </div>
                                                            <div className="mt-1 text-xs text-zinc-500">Phase III • 8 miles • 5 months</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {index === 3 && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-blue-500/20">
                                                            <span className="text-xs text-blue-400">●</span>
                                                        </div>
                                                        <span className="text-blue-400">Mapbox Integration</span>
                                                        <span className="ml-auto text-zinc-500">Live</span>
                                                    </div>
                                                    <div className="mt-4 rounded-lg bg-zinc-800/50 p-4 relative overflow-hidden">
                                                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                                                        <div className="relative z-10">
                                                            <div className="text-xs text-zinc-400 mb-3">Global Trial Distribution</div>
                                                            <div className="space-y-2 font-mono text-xs">
                                                                <div className="flex justify-between items-center text-zinc-500">
                                                                    <span>Region</span>
                                                                    <span>Relative Density</span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-blue-400">California</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                                                                            <div className="w-[90%] h-full bg-blue-500"></div>
                                                                        </div>
                                                                        <span className="text-[10px] text-zinc-500">9.9%</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-blue-400">France</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                                                                            <div className="w-[56%] h-full bg-blue-500"></div>
                                                                        </div>
                                                                        <span className="text-[10px] text-zinc-500">6.2%</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-blue-400">China</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                                                                            <div className="w-[35%] h-full bg-blue-500"></div>
                                                                        </div>
                                                                        <span className="text-[10px] text-zinc-500">3.9%</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-blue-400">Florida</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                                                                            <div className="w-[31%] h-full bg-blue-500"></div>
                                                                        </div>
                                                                        <span className="text-[10px] text-zinc-500">3.5%</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-blue-400">Texas</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                                                                            <div className="w-[27%] h-full bg-blue-500"></div>
                                                                        </div>
                                                                        <span className="text-[10px] text-zinc-500">3.0%</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 flex items-center justify-between text-xs text-zinc-600">
                                                        <span>📍 1,000+ Active Sites</span>
                                                        <span>Powered by Mapbox</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </section>
                    ))}

                    {/* Bottom Spacer - Provides scroll distance for menu and cards to exit together */}
                    <div className="h-screen" />
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
