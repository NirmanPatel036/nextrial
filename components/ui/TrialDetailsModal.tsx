'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Activity, Calendar, Users, FileText } from 'lucide-react';
import { Trial } from '@/lib/types';
import { Button } from './Button';
import GlassCard from './GlassCard';

interface TrialDetailsModalProps {
    trial: Trial | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function TrialDetailsModal({ trial, isOpen, onClose }: TrialDetailsModalProps) {
    if (!trial) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        <div className="w-full max-w-4xl h-[90vh]" onClick={(e) => e.stopPropagation()}>
                            <GlassCard className="h-full flex flex-col">
                                {/* Header with close button - fixed */}
                                <div className="flex-shrink-0 flex justify-end pt-4 pr-4 pb-2">
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto px-6 pb-6" data-lenis-prevent>
                                    {/* Header */}
                                    <div className="mb-6">
                                        <div className="flex items-center space-x-3 flex-wrap gap-2 mb-4">
                                            <span className="text-sm font-mono text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                                                {trial.nct_id}
                                            </span>
                                            <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                                                {trial.phase === 'NA' || trial.phase === 'N/A' ? 'Not Applicable' : trial.phase}
                                            </span>
                                            <span
                                                className={`text-sm font-semibold px-3 py-1.5 rounded-full ${trial.status === 'RECRUITING'
                                                    ? 'bg-success/20 text-green-600'
                                                    : 'bg-muted text-muted-foreground'
                                                    }`}
                                            >
                                                {trial.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>

                                        <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                                            {trial.title}
                                        </h2>

                                        {trial.official_title && trial.official_title !== trial.title && (
                                            <p className="text-muted-foreground italic">
                                                {trial.official_title}
                                            </p>
                                        )}
                                    </div>

                                    {/* Summary */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                                            <FileText className="w-5 h-5 mr-2 text-primary" />
                                            Summary
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {trial.brief_summary}
                                        </p>
                                    </div>

                                    {/* Conditions */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                                            <Activity className="w-5 h-5 mr-2 text-primary" />
                                            Conditions
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {trial.condition.map((condition, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-sm bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full"
                                                >
                                                    {condition}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Interventions */}
                                    {trial.interventions && trial.interventions.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                                Interventions
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {trial.interventions.map((intervention, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full"
                                                    >
                                                        {intervention}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Eligibility */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                                            <Users className="w-5 h-5 mr-2 text-primary" />
                                            Eligibility
                                        </h3>
                                        <div className="space-y-2 mb-3">
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className="text-muted-foreground">Age:</span>
                                                <span className="font-medium text-foreground">
                                                    {trial.min_age} to {trial.max_age}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className="text-muted-foreground">Gender:</span>
                                                <span className="font-medium text-foreground">
                                                    {trial.gender}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-4">
                                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                                                {trial.eligibility_criteria}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Locations */}
                                    {trial.locations && trial.locations.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                                                <MapPin className="w-5 h-5 mr-2 text-primary" />
                                                Locations ({trial.locations.length})
                                            </h3>
                                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                                {trial.locations.map((location, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-muted/50 rounded-lg p-3"
                                                    >
                                                        <div className="font-semibold text-foreground">
                                                            {location.facility}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {location.city}
                                                            {location.state && `, ${location.state}`}
                                                            {location.country && `, ${location.country}`}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer actions */}
                                    <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
                                        <Button variant="outline" onClick={onClose}>
                                            Close
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                window.open(
                                                    `https://clinicaltrials.gov/study/${trial.nct_id}`,
                                                    '_blank'
                                                );
                                            }}
                                        >
                                            View on ClinicalTrials.gov
                                        </Button>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
