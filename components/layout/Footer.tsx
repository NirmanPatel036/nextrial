'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    const footerSections = {
        platform: {
            title: 'Platform',
            links: [
                { label: 'Home', href: '/home' },
                { label: 'Search Trials', href: '/search' },
                { label: 'Saved Trials', href: '/saved' },
                { label: 'Chat Assistant', href: '/chat' },
            ],
        },
        about: {
            title: 'Help',
            links: [
                { label: 'About Us', href: '/about' },
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'Settings', href: '/settings' },
            ],
        },
        resources: {
            title: 'Resources',
            links: [
                { label: 'ClinicalTrials.gov', href: 'https://clinicaltrials.gov' },
                { label: 'PubMed', href: 'https://pubmed.ncbi.nlm.nih.gov' },
                { label: 'RxNorm', href: 'https://www.nlm.nih.gov/research/umls/rxnorm' },
            ],
        },
        connect: {
            title: 'Connect',
            links: [
                { label: 'LinkedIn', href: 'https://linkedin.com/in/nirmanpatel' },
                { label: 'Twitter', href: 'https://x.com/nirman_patel_09?s=21' },
                { label: 'GitHub', href: 'https://github.com/NirmanPatel036' },
            ],
        },
        legal: {
            title: 'Legal',
            links: [
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
            ],
        },
    };

    return (
        <footer className="relative bg-background border-t border-border overflow-hidden">
            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-32 justify-items-center">
                    {Object.entries(footerSections).map(([key, section]) => (
                        <div key={key}>
                            <h3 className="font-semibold text-foreground mb-4 text-sm">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Large Background Text - Filled with color, cropped at bottom */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pointer-events-none overflow-hidden h-64">
                <div
                    className="text-[18rem] md:text-[22rem] lg:text-[28rem] font-serif font-bold leading-none tracking-tighter whitespace-nowrap"
                    style={{
                        color: 'rgba(176, 90, 54, 0.75)',
                        transform: 'translateY(30%)',
                        userSelect: 'none',
                    }}
                >
                    nextrial
                </div>
            </div>
        </footer>
    );
};

export default Footer;
