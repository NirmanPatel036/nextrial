'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import OrbitingItems from '@/components/ui/orbiting-items';
import { fadeInUp } from '@/lib/animations';

export default function Integrations() {
    const orbitingItems = [
        <div key="ctg" className="p-2">
            <Image src="/ctg.png" alt="ClinicalTrials.gov" width={32} height={32} className="object-contain" />
        </div>,
        <div key="fhir" className="p-2">
            <Image src="/fhir.png" alt="FHIR" width={32} height={32} className="object-contain" />
        </div>,
        <div key="supabase" className="p-2">
            <Image src="/supabase.png" alt="Supabase" width={32} height={32} className="object-contain" />
        </div>,
        <div key="pubmed" className="p-2">
            <Image src="/pubmed.jpeg" alt="PubMed" width={32} height={32} className="object-contain rounded" />
        </div>,
        <div key="mapbox" className="p-2">
            <Image src="/mapbox.png" alt="Mapbox" width={32} height={32} className="object-contain" />
        </div>,
        <div key="modal" className="p-2">
            <Image src="/modal.png" alt="Modal" width={32} height={32} className="object-contain" />
        </div>,
    ];

    const centerLogo = (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl">
            <Image src="/logo.png" alt="NexTrial Logo" width={64} height={64} className="object-contain" />
        </div>
    );

    return (
        <section className="relative py-24 overflow-hidden">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold text-primary bg-primary/10 rounded-full">
                        Integrations
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">MCP Enabled. <br />Endless Possibilities.</h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Our Model Context Protocol (MCP) integration seamlessly connects external data sources to our
                        RAG pipeline. By integrating{' '}
                        <span className="inline-block px-2 py-0.2 mx-0.5 rounded-md bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-medium">
                            ClinicalTrials.gov
                        </span>
                        ,{' '}
                        <span className="inline-block px-2 py-0.2 mx-0.5 rounded-md bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 font-medium">
                            FHIR
                        </span>
                        -compliant patient records, vector databases via{' '}
                        <span className="inline-block px-2 py-0.2 mx-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-medium">
                            Supabase
                        </span>
                        ,{' '}
                        <span className="inline-block px-2 py-0.2 mx-0.5 rounded-md bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-medium">
                            PubMed
                        </span>
                        {' '}research articles, and location services
                        through{' '}
                        <span className="inline-block px-2 py-0.2 mx-0.5 rounded-md bg-violet-100 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800 font-medium">
                            Mapbox
                        </span>
                        , all powered by{' '}
                        <span className="inline-block px-2 py-0.2 mx-0.5 rounded-md bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 font-medium">
                            Modal
                        </span>
                        's serverless infrastructure for scalable AI inference,
                        we provide comprehensive, real-time clinical trial matching powered by AI.
                    </p>
                </motion.div>

                {/* Orbiting Items */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <OrbitingItems
                        radius={48}
                        items={orbitingItems}
                        pauseOnHover={true}
                        centerContent={centerLogo}
                        className="h-80 w-80 md:h-96 md:w-96"
                    />
                </motion.div>
            </div>
        </section>
    );
}
