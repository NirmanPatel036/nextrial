'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export interface StickyScrollContent {
    title: string;
    description: string;
    content?: React.ReactNode | string;
}

interface StickyScrollRevealProps {
    content: StickyScrollContent[];
    contentClassName?: string;
}

export const StickyScrollReveal: React.FC<StickyScrollRevealProps> = ({
    content,
    contentClassName,
}) => {
    const [activeCard, setActiveCard] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    const cardLength = content.length;

    useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            const cardsBreakpoints = content.map((_, index) => index / cardLength);
            const closestBreakpointIndex = cardsBreakpoints.reduce(
                (acc, breakpoint, index) => {
                    const distance = Math.abs(latest - breakpoint);
                    if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
                        return index;
                    }
                    return acc;
                },
                0
            );
            setActiveCard(closestBreakpointIndex);
        });

        return () => unsubscribe();
    }, [scrollYProgress, cardLength, content]);

    const backgroundColors = [
        'var(--background)',
        'var(--background)',
        'var(--background)',
        'var(--background)',
    ];

    const linearGradients = [
        'linear-gradient(to bottom right, var(--primary), var(--success))',
        'linear-gradient(to bottom right, var(--success), var(--primary))',
        'linear-gradient(to bottom right, var(--primary), var(--success))',
        'linear-gradient(to bottom right, var(--success), var(--primary))',
    ];

    const backgroundGradient = useTransform(
        scrollYProgress,
        content.map((_, i) => i / cardLength),
        linearGradients
    );

    return (
        <motion.div
            className="relative flex h-[30rem] justify-center space-x-10 rounded-md p-10"
            ref={ref}
        >
            <div className="div relative flex items-start px-4">
                <div className="max-w-2xl">
                    {content.map((item, index) => (
                        <div key={item.title + index} className="my-20">
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: activeCard === index ? 1 : 0.3,
                                }}
                                className="font-serif text-2xl font-bold text-foreground"
                            >
                                {item.title}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: activeCard === index ? 1 : 0.3,
                                }}
                                className="text-kg mt-10 max-w-sm text-muted-foreground"
                            >
                                {item.description}
                            </motion.p>
                        </div>
                    ))}
                    <div className="h-40" />
                </div>
            </div>
            <div
                className={`sticky top-10 hidden h-[500px] w-[600px] overflow-hidden rounded-md lg:block ${contentClassName}`}
            >
                {content[activeCard].content ?? null}
            </div>
        </motion.div>
    );
};
