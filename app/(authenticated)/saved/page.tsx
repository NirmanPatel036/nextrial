'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Trash2, MessageSquare, ExternalLink, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { fadeInUp } from '@/lib/animations';
import { createBrowserClient } from '@supabase/ssr';
import { SavedTrial, Trial } from '@/lib/types';
import { useRouter } from 'next/navigation';
import TrialDetailsModal from '@/components/ui/TrialDetailsModal';
import { getTrialByNCTId } from '@/lib/api';

export default function SavedTrialsPage() {
    const [savedTrials, setSavedTrials] = useState<SavedTrial[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
    const [selectedTrialNctId, setSelectedTrialNctId] = useState<string | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalTrial, setModalTrial] = useState<Trial | null>(null);
    const [patientProfile, setPatientProfile] = useState<any>(null);
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        loadSavedTrials();
    }, []);

    const loadSavedTrials = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/auth/login';
                return;
            }

            // Load saved trials
            const { data, error } = await supabase
                .from('saved_trials')
                .select('*')
                .eq('user_id', user.id)
                .order('saved_at', { ascending: false });

            if (error) throw error;
            setSavedTrials(data || []);

            // Load patient profile
            const { data: profileData, error: profileError } = await supabase
                .from('patient_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (!profileError && profileData) {
                setPatientProfile(profileData);
            }
        } catch (error) {
            console.error('Error loading saved trials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setDeletingIds(prev => new Set(prev).add(id));

            const { error } = await supabase
                .from('saved_trials')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setSavedTrials(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting trial:', error);
            alert('Failed to delete trial. Please try again.');
        } finally {
            setDeletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    const handleCheckEligibility = (trial: SavedTrial) => {
        let query = `Check my eligibility for clinical trial ${trial.nct_id}: ${trial.title}.\n\nTrial Details:\n- Conditions: ${trial.condition?.join(', ')}\n- Phase: ${trial.phase}\n- Status: ${trial.status}`;

        // Add patient profile information if available
        if (patientProfile) {
            query += `\n\nMy Profile:\n`;
            if (patientProfile.diagnosis) query += `- Diagnosis: ${patientProfile.diagnosis}\n`;
            if (patientProfile.stage) query += `- Stage: ${patientProfile.stage}\n`;
            if (patientProfile.current_treatment) query += `- Current Treatment: ${patientProfile.current_treatment}\n`;
            if (patientProfile.date_of_birth) {
                const age = new Date().getFullYear() - new Date(patientProfile.date_of_birth).getFullYear();
                query += `- Age: ${age} years\n`;
            }
            if (patientProfile.city && patientProfile.state) {
                query += `- Location: ${patientProfile.city}, ${patientProfile.state}\n`;
            }
            if (patientProfile.allergies) query += `- Allergies: ${patientProfile.allergies}\n`;
        }

        query += `\n\nPlease analyze my eligibility for this trial based on my profile and the trial's eligibility criteria.`;
        window.location.href = `/chat?q=${encodeURIComponent(query)}`;
    };

    const handleViewDetails = async (nctId: string) => {
        setSelectedTrialNctId(nctId);
        setShowDetailsModal(true);
    };

    const filteredTrials = savedTrials.filter(trial =>
        searchQuery === '' ||
        trial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trial.nct_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trial.condition?.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Fetch full trial details for modal
    useEffect(() => {
        if (selectedTrialNctId) {
            // Fetch trial details from local data
            getTrialByNCTId(selectedTrialNctId)
                .then(data => setModalTrial(data))
                .catch(err => console.error('Error loading trial details:', err));
        }
    }, [selectedTrialNctId]);

    return (
        <main className="pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="mb-12"
                >
                    <div className="flex items-center mb-4">
                        <Bookmark className="w-10 h-10 text-primary mr-3" />
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                            Saved Trials
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground">
                        Review and manage your bookmarked clinical trials
                    </p>
                </motion.div>

                {/* Search */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="mb-8"
                >
                    <GlassCard className="py-3 rounded-full">
                        <div className="flex items-center space-x-3">
                            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search saved trials..."
                                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
                            />
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Results count */}
                {!loading && (
                    <div className="mb-6 text-sm text-muted-foreground">
                        {filteredTrials.length} saved trial{filteredTrials.length !== 1 ? 's' : ''}
                        {searchQuery && ` matching "${searchQuery}"`}
                    </div>
                )}

                {/* Trials List */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-6">
                        {[1, 2, 3].map((i) => (
                            <GlassCard key={i} className="h-48 animate-pulse">
                                <div />
                            </GlassCard>
                        ))}
                    </div>
                ) : filteredTrials.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredTrials.map((trial) => (
                            <GlassCard key={trial.id} hover className="h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3 flex-wrap gap-2">
                                        <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full">
                                            {trial.nct_id}
                                        </span>
                                        {trial.phase && (
                                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground">
                                                {trial.phase === 'NA' || trial.phase === 'N/A' ? 'Not Applicable' : trial.phase}
                                            </span>
                                        )}
                                        {trial.status && (
                                            <span
                                                className={`text-xs font-semibold px-3 py-1 rounded-full ${trial.status === 'RECRUITING'
                                                    ? 'bg-success/10 text-success'
                                                    : 'bg-muted text-muted-foreground'
                                                    }`}
                                            >
                                                {trial.status.replace(/_/g, ' ')}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        Saved {new Date(trial.saved_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                                    {trial.title}
                                </h3>

                                {/* Conditions */}
                                {trial.condition && trial.condition.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {trial.condition.slice(0, 5).map((condition, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                                                >
                                                    {condition}
                                                </span>
                                            ))}
                                            {trial.condition.length > 5 && (
                                                <span className="text-xs text-muted-foreground px-2 py-1">
                                                    +{trial.condition.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Brief summary */}
                                {trial.brief_summary && (
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {trial.brief_summary}
                                    </p>
                                )}

                                {/* Notes */}
                                {trial.notes && (
                                    <div className="bg-muted/50 rounded-lg p-3 mb-4">
                                        <p className="text-sm text-muted-foreground italic">
                                            Note: {trial.notes}
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center space-x-3 pt-4 border-t border-border">
                                    <Button
                                        size="sm"
                                        onClick={() => handleViewDetails(trial.nct_id)}
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleCheckEligibility(trial)}
                                    >
                                        <MessageSquare className="w-4 h-4 mr-1" />
                                        Check Eligibility
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => window.open(`https://clinicaltrials.gov/study/${trial.nct_id}`, '_blank')}
                                    >
                                        <ExternalLink className="w-4 h-4 mr-1" />
                                        ClinicalTrials.gov
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(trial.id)}
                                        disabled={deletingIds.has(trial.id)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        {deletingIds.has(trial.id) ? 'Removing...' : 'Remove'}
                                    </Button>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                ) : (
                    <GlassCard className="py-16 text-center">
                        <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2">
                            {searchQuery ? 'No matching trials found' : 'No saved trials yet'}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            {searchQuery
                                ? 'Try adjusting your search query'
                                : 'Start exploring clinical trials and save the ones that interest you'}
                        </p>
                        {!searchQuery && (
                            <Button onClick={() => window.location.href = '/search'}>
                                Browse Trials
                            </Button>
                        )}
                    </GlassCard>
                )}
            </div>

            {/* Trial Details Modal */}
            <TrialDetailsModal
                trial={modalTrial}
                isOpen={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedTrialNctId(null);
                    setModalTrial(null);
                }}
            />
        </main>
    );
}
