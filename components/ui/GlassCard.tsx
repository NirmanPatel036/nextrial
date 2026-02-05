'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    dark?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className,
    hover = false,
    dark = false,
}) => {
    const baseClasses = dark ? 'glass-dark' : 'glass';

    if (hover) {
        return (
            <motion.div
                className={cn(
                    baseClasses,
                    'rounded-3xl p-6 premium-shadow',
                    className
                )}
                whileHover={{
                    scale: 1.02,
                    backdropFilter: dark ? 'blur(25px)' : 'blur(25px)',
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div
            className={cn(
                baseClasses,
                'rounded-3xl p-6 premium-shadow',
                className
            )}
        >
            {children}
        </div>
    );
};

export default GlassCard;
