'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { fadeInUp } from '@/lib/animations';
import { animateCounter } from '@/lib/animations';

const Statistics = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [hasAnimated, setHasAnimated] = useState(false);

    const stats = [
        {
            value: 1000,
            suffix: '',
            label: 'Clinical Trials Indexed',
            description: 'Comprehensive database of active and recruiting trials',
        },
        {
            value: 119,
            suffix: '',
            label: 'Patient Records Analyzed',
            description: 'Leveraging vast medical data for accurate matching',
        },
        {
            value: 95,
            suffix: '%',
            label: 'Match Accuracy',
            description: 'AI-powered precision in trial recommendations',
        },
    ];

    useEffect(() => {
        if (isInView && !hasAnimated) {
            setHasAnimated(true);
            stats.forEach((stat, index) => {
                const element = document.getElementById(`stat-${index}`);
                if (element) {
                    setTimeout(() => {
                        animateCounter(element, stat.value, 2000, stat.suffix);
                    }, index * 200);
                }
            });
        }
    }, [isInView, hasAnimated]);

    return (
        <section ref={ref} className="py-32 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                        By The Numbers
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-4">
                        Trained on thousands
                    </h2>
                </motion.div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            initial="hidden"
                            animate={isInView ? 'visible' : 'hidden'}
                            transition={{ delay: index * 0.2 }}
                        >
                            <GlassCard className="text-center h-full">
                                <div
                                    id={`stat-${index}`}
                                    className="font-serif text-6xl md:text-7xl font-bold text-primary mb-4"
                                >
                                    0{stat.suffix}
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">
                                    {stat.label}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {stat.description}
                                </p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;
