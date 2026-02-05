'use client';

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

// Dynamically import components to avoid SSR issues
const LightPillar = dynamic(
    () => import('@/components/three/LightPillar'),
    { ssr: false }
);





const Hero = () => {
    return (
        <>


            <section className="hero-section relative min-h-screen flex items-center overflow-hidden bg-black">
                {/* LightPillar Background */}
                <div className="absolute inset-0 w-full h-full">
                    <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
                        <LightPillar
                            topColor="#ffb43f"
                            bottomColor="#ffe4a8"
                            intensity={1}
                            rotationSpeed={0.3}
                            glowAmount={0.002}
                            pillarWidth={3}
                            pillarHeight={0.4}
                            noiseIntensity={0.5}
                            pillarRotation={25}
                            interactive={false}
                            mixBlendMode="screen"
                            quality="high"
                        />
                    </Suspense>
                </div>

                {/* Content - Centered layout */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 w-full">
                    <div className="flex flex-col justify-between min-h-[calc(100vh-5rem)]">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="max-w-2xl pt-8 md:pt-16"
                        >
                            {/* Headline - Multi-line with fade in animation */}
                            <motion.h1
                                className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white mb-8 md:mb-12 leading-tight tracking-tight"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                            >
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.7 }}
                                    className="block"
                                >
                                    Cancer is <i>hard</i>.
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 1.0 }}
                                    className="block"
                                >
                                    But there
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 1.3 }}
                                    className="block"
                                >
                                    is <i>hope</i>.
                                </motion.span>
                            </motion.h1>

                            {/* Subtext with fade in */}
                            <motion.p
                                className="text-base md:text-lg text-white/70 mb-8 md:mb-10 leading-relaxed max-w-xl font-light"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.6 }}
                            >
                                We bring precision oncology into your hands, matching you with <br />clinical trials using AI-driven insights—no matter your cancer <br />type or stage.
                            </motion.p>

                            {/* Single CTA Button with fade in */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.9 }}
                            >
                                <Button
                                    size="sm"
                                    asChild
                                    className="text-sm md:text-base px-4 py-2 bg-white/90 text-black hover:bg-white rounded-full font-medium"
                                >
                                    <Link href="/home">Find Your Match</Link>
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Bottom Branding - Responsive positioning */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 2.2 }}
                            className="mt-auto pb-4 md:pb-8 lg:pb-12"
                        >
                            <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white/90 tracking-tight">
                                nextrial.
                            </h2>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: 1,
                        repeat: Infinity,
                        repeatType: 'reverse',
                    }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
                        <div className="w-1 h-3 bg-white/70 rounded-full" />
                    </div>
                </motion.div>
            </section>
        </>
    );
};

export default Hero;
