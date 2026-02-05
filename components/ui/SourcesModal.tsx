'use client';

import { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Source {
    type: string;
    id: string;
    relevance: string;
}

interface SourcesModalProps {
    sources: Source[];
    isOpen: boolean;
    onClose: () => void;
}

export default function SourcesModal({ sources, isOpen, onClose }: SourcesModalProps) {
    if (!isOpen) return null;

    const getSourceUrl = (source: Source) => {
        if (source.type.toLowerCase().includes('pubmed')) {
            return `https://pubmed.ncbi.nlm.nih.gov/${source.id}`;
        }
        return `https://clinicaltrials.gov/study/${source.id}`;
    };

    const getSourceLogo = (source: Source) => {
        if (source.type.toLowerCase().includes('pubmed')) {
            return '/pubmed.jpeg';
        }
        return '/ctg.png';
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl z-50 max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <h2 className="text-lg font-semibold">Sources ({sources.length})</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sources List */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
                    <div className="space-y-3">
                        {sources.map((source, idx) => (
                            <a
                                key={idx}
                                href={getSourceUrl(source)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                            >
                                {/* Source Logo */}
                                <div className="flex-shrink-0">
                                    <Image
                                        src={getSourceLogo(source)}
                                        alt={source.type}
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover"
                                    />
                                </div>

                                {/* Source Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-muted-foreground uppercase">
                                            {source.type}
                                        </span>
                                        {source.relevance && (
                                            <span className="text-xs text-muted-foreground">
                                                • {source.relevance}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                        {source.id}
                                    </p>
                                </div>

                                {/* External Link Icon */}
                                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
