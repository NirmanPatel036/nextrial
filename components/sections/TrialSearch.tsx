'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, MapPin, Activity, TrendingUp, PlusCircle, ArrowRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import Link from 'next/link';
import { getRandomRecruitingTrials } from '@/lib/api';
import { Trial } from '@/lib/types';

const PLACEHOLDER_TEXTS = [
    "Search for trials by condition...",
    "Search for trials by location...",
    "Search by NCT ID (e.g. NCT12345)...",
    "Find hope matching your profile..."
];

const useTypewriter = (text: string[], typingSpeed = 50, deletingSpeed = 30, pauseDuration = 2000) => {
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [speed, setSpeed] = useState(typingSpeed);

    useEffect(() => {
        const i = loopNum % text.length;
        const fullText = text[i];

        const handleTyping = () => {
            setDisplayText(current => isDeleting
                ? fullText.substring(0, current.length - 1)
                : fullText.substring(0, current.length + 1)
            );

            setSpeed(isDeleting ? deletingSpeed : typingSpeed);

            if (!isDeleting && displayText === fullText) {
                setTimeout(() => setIsDeleting(true), pauseDuration);
            } else if (isDeleting && displayText === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, speed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, loopNum, speed, text, typingSpeed, deletingSpeed, pauseDuration]);

    return displayText;
};

const TrialSearch = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [trials, setTrials] = useState<Trial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    const placeholderText = useTypewriter(PLACEHOLDER_TEXTS);

    useEffect(() => {
        const loadTrials = async () => {
            try {
                const data = await getRandomRecruitingTrials(10);
                setTrials(data);
            } catch (error) {
                console.error('Error loading trials:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTrials();
    }, []);

    const filters = [
        { label: 'Phase 3', icon: Activity },
        { label: 'Recruiting', icon: TrendingUp },
        { label: 'Breast Cancer', icon: Search },
        { label: 'Boston, MA', icon: MapPin },
    ];

    return (
        <section ref={ref} className="py-32 bg-gradient-to-b from-background to-primary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                        Trial Search
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                        Discover relevant clinical trials
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Search through thousands of trials with intelligent filters and AI-powered matching.
                    </p>
                </motion.div>

                {/* Search Interface */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="mb-12"
                >
                    <GlassCard className="max-w-4xl mx-auto">
                        <div className="flex items-center space-x-4 mb-6">
                            <Search className="w-6 h-6 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder={placeholderText}
                                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg"
                            />
                            <Button>Search</Button>
                        </div>

                        {/* Filter Chips */}
                        <div className="flex flex-wrap gap-2">
                            {filters.map((filter, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                                >
                                    <filter.icon className="w-4 h-4" />
                                    <span>{filter.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </GlassCard>
                </motion.div>
            </div>

            {/* Infinite Scrolling Trial Cards - Full Width */}
            <div 
                className="relative mb-12 overflow-hidden -mx-4"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Left fade overlay */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background via-background/50 to-transparent z-10 pointer-events-none" />
                {/* Right fade overlay */}
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background via-background/50 to-transparent z-10 pointer-events-none" />

                    {loading ? (
                        // Loading state
                        <div className="flex gap-6 py-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex-shrink-0 w-80">
                                    <GlassCard className="h-64 animate-pulse">
                                        <div className="h-full bg-muted/10"></div>
                                    </GlassCard>
                                </div>
                            ))}
                        </div>
                    ) : trials.length > 0 ? (
                        <motion.div
                            className="flex gap-6 py-4"
                            animate={{
                                x: isPaused ? undefined : [0, -1 * (trials.length * 336)], // 336 = 320px width + 16px gap
                            }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: trials.length * 3, // 3 seconds per card
                                    ease: "linear",
                                },
                            }}
                        >
                            {/* First set of cards */}
                            {trials.map((trial, index) => {
                                const primaryLocation = trial.locations[0];
                                const locationString = primaryLocation
                                    ? `${primaryLocation.city}, ${primaryLocation.state || primaryLocation.country}`
                                    : 'Multiple Locations';
                                const matchScore = 90 - (index % 10) * 3;

                                return (
                                    <div key={`first-${trial.nct_id}`} className="flex-shrink-0 w-80">
                                        <GlassCard className="hover:border-primary/30 transition-colors duration-300">
                                            <div className="flex flex-col p-2.5 space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                        {trial.nct_id}
                                                    </span>
                                                    <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded ${trial.status === 'RECRUITING' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                                                        {trial.status.toLowerCase()}
                                                    </span>
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-sm text-foreground mb-0.5 line-clamp-2">
                                                        {trial.title}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground mb-0.5">
                                                        Phase {trial.phase === 'NA' || trial.phase === 'N/A' ? 'N/A' : trial.phase}
                                                    </p>
                                                    <div className="flex items-center text-muted-foreground text-xs">
                                                        <MapPin className="w-3 h-3 mr-1 shrink-0" />
                                                        <span className="line-clamp-1">{locationString}</span>
                                                    </div>
                                                </div>

                                                <div className="pt-1.5 border-t border-border/50">
                                                    <div className="flex justify-between items-center text-xs mb-1">
                                                        <span className="font-medium text-foreground">Match Score</span>
                                                        <span className="font-bold text-primary">{matchScore}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-muted/20 rounded-full overflow-hidden border border-border">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500"
                                                            style={{ width: `${matchScore}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </div>
                                );
                            })}
                            {/* Duplicate set for infinite loop */}
                            {trials.map((trial, index) => {
                                const primaryLocation = trial.locations[0];
                                const locationString = primaryLocation
                                    ? `${primaryLocation.city}, ${primaryLocation.state || primaryLocation.country}`
                                    : 'Multiple Locations';
                                const matchScore = 90 - (index % 10) * 3;

                                return (
                                    <div key={`second-${trial.nct_id}`} className="flex-shrink-0 w-80">
                                        <GlassCard className="hover:border-primary/30 transition-colors duration-300">
                                            <div className="flex flex-col p-2.5 space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                        {trial.nct_id}
                                                    </span>
                                                    <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded ${trial.status === 'RECRUITING' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                                                        {trial.status.toLowerCase()}
                                                    </span>
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-sm text-foreground mb-0.5 line-clamp-2">
                                                        {trial.title}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground mb-0.5">
                                                        Phase {trial.phase === 'NA' || trial.phase === 'N/A' ? 'N/A' : trial.phase}
                                                    </p>
                                                    <div className="flex items-center text-muted-foreground text-xs">
                                                        <MapPin className="w-3 h-3 mr-1 shrink-0" />
                                                        <span className="line-clamp-1">{locationString}</span>
                                                    </div>
                                                </div>

                                                <div className="pt-1.5 border-t border-border/50">
                                                    <div className="flex justify-between items-center text-xs mb-1">
                                                        <span className="font-medium text-foreground">Match Score</span>
                                                        <span className="font-bold text-primary">{matchScore}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-muted/20 rounded-full overflow-hidden border border-border">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500"
                                                            style={{ width: `${matchScore}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No trials found</p>
                        </div>
                    )}
                </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* CTA */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="text-center"
                >
                    <Button size="lg" asChild>
                        <Link href="/search">View All Trials</Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default TrialSearch;
