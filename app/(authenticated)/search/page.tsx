'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Activity, Filter, Map as MapIcon, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import { searchTrialsLocal } from '@/lib/api';
import { Trial, TrialSearchParams } from '@/lib/types';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import TrialDetailsModal from '@/components/ui/TrialDetailsModal';

// Dynamically import TrialMap to avoid SSR issues with Mapbox
const TrialMap = dynamic(() => import('@/components/ui/TrialMap'), {
    ssr: false,
    loading: () => (
        <GlassCard className="h-[600px] flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading map...</p>
            </div>
        </GlassCard>
    ),
});

export default function SearchPage() {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [trials, setTrials] = useState<Trial[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTrial, setSelectedTrial] = useState<Trial | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [savingTrials, setSavingTrials] = useState<Set<string>>(new Set());
    const [savedTrials, setSavedTrials] = useState<Set<string>>(new Set());
    const [patientProfile, setPatientProfile] = useState<any>(null);
    const [filters, setFilters] = useState({
        status: [] as string[],
        phase: [] as string[],
        gender: '',
    });
    const resultsRef = React.useRef<HTMLDivElement>(null);
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const pageSize = 20;

    // Load trials whenever dependencies change
    useEffect(() => {
        const loadTrials = async () => {
            setLoading(true);
            try {
                const params: TrialSearchParams = {
                    query: searchQuery,
                    filters: {
                        status: filters.status.length > 0 ? filters.status : undefined,
                        phase: filters.phase.length > 0 ? filters.phase : undefined,
                        gender: filters.gender || undefined,
                    },
                    page: currentPage,
                    pageSize,
                };

                console.log('Loading trials - Page:', currentPage, 'Query:', searchQuery);
                const result = await searchTrialsLocal(params);
                console.log('Loaded:', result.trials.length, 'trials, Total:', result.total);

                setTrials(result.trials);
                setTotalPages(result.totalPages);
                setTotalResults(result.total);
            } catch (error) {
                console.error('Error loading trials:', error);
                setTrials([]);
            } finally {
                setLoading(false);
            }
        };

        loadTrials();
    }, [currentPage, searchQuery, filters.status.join(','), filters.phase.join(','), filters.gender]);

    // Separate effect for scrolling to top when page changes
    useEffect(() => {
        if (currentPage > 1) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentPage]);

    // Debug: Log trials and loading state changes
    useEffect(() => {
        console.log('State update - trials.length:', trials.length, 'loading:', loading);
    }, [trials, loading]);

    // Load user's saved trials and patient profile
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Load saved trials
                const { data: savedData, error: savedError } = await supabase
                    .from('saved_trials')
                    .select('nct_id')
                    .eq('user_id', user.id);

                if (savedError) throw savedError;
                setSavedTrials(new Set(savedData.map(t => t.nct_id)));

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
                console.error('Error loading user data:', error);
            }
        };

        loadUserData();
    }, [supabase]);

    const handleViewDetails = async (trial: Trial) => {
        setSelectedTrial(trial);
        setShowDetailsModal(true);
    };

    const handleSaveTrial = async (trial: Trial) => {
        try {
            setSavingTrials(prev => new Set(prev).add(trial.nct_id));

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/auth/login';
                return;
            }

            // Check if already saved
            if (savedTrials.has(trial.nct_id)) {
                // Unsave
                const { error } = await supabase
                    .from('saved_trials')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('nct_id', trial.nct_id);

                if (error) throw error;

                setSavedTrials(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(trial.nct_id);
                    return newSet;
                });
            } else {
                // Save
                const { error } = await supabase
                    .from('saved_trials')
                    .insert({
                        user_id: user.id,
                        nct_id: trial.nct_id,
                        title: trial.title,
                        status: trial.status,
                        phase: trial.phase,
                        condition: trial.condition,
                        brief_summary: trial.brief_summary,
                    });

                if (error) throw error;

                setSavedTrials(prev => new Set(prev).add(trial.nct_id));
            }
        } catch (error) {
            console.error('Error saving trial:', error);
            alert('Failed to save trial. Please try again.');
        } finally {
            setSavingTrials(prev => {
                const newSet = new Set(prev);
                newSet.delete(trial.nct_id);
                return newSet;
            });
        }
    };

    const handleCheckEligibility = (trial: Trial) => {
        let query = `Check my eligibility for clinical trial ${trial.nct_id}: ${trial.title}.\n\nTrial Details:\n- Conditions: ${trial.condition.join(', ')}\n- Phase: ${trial.phase}\n- Status: ${trial.status}`;

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

    const handleSearch = () => {
        setCurrentPage(1);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleFilter = (filterType: 'status' | 'phase', value: string) => {
        setFilters(prev => {
            const currentValues = prev[filterType];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return { ...prev, [filterType]: newValues };
        });
        setCurrentPage(1);
    };

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
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Search Clinical Trials
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Discover trials that match your profile using RAG-powered search
                    </p>
                </motion.div>

                {/* Search Bar */}
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
                                onKeyPress={handleKeyPress}
                                placeholder="Search by condition, location, NCT ID, or keywords..."
                                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
                            />
                            <Button onClick={handleSearch} size="sm">Search</Button>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Filters and View Toggle */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            className="flex items-center space-x-2"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                        </Button>

                        {/* Quick filter chips */}
                        {showFilters && (
                            <div className="flex flex-wrap gap-2">
                                {['RECRUITING', 'ACTIVE_NOT_RECRUITING'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => toggleFilter('status', status)}
                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${filters.status.includes(status)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                            }`}
                                    >
                                        {status.replace(/_/g, ' ')}
                                    </button>
                                ))}
                                {['PHASE1', 'PHASE2', 'PHASE3', 'PHASE4'].map(phase => (
                                    <button
                                        key={phase}
                                        onClick={() => toggleFilter('phase', phase)}
                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${filters.phase.includes(phase)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                            }`}
                                    >
                                        {phase}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 bg-muted rounded-full p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${viewMode === 'list'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <List className="w-4 h-4" />
                            <span>List</span>
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${viewMode === 'map'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <MapIcon className="w-4 h-4" />
                            <span>Map</span>
                        </button>
                    </div>
                </div>

                {/* Results count */}
                <div ref={resultsRef}>
                    {!loading && (
                        <div className="mb-6 text-sm text-muted-foreground">
                            Found {totalResults.toLocaleString()} trials
                            {searchQuery && ` for "${searchQuery}"`}
                        </div>
                    )}
                </div>

                {/* Results */}
                {viewMode === 'list' ? (
                    <>
                        {loading ? (
                            <div className="grid grid-cols-1 gap-6 mb-8">
                                {[1, 2, 3].map((i) => (
                                    <GlassCard key={i} className="h-48 animate-pulse">
                                        <div />
                                    </GlassCard>
                                ))}
                            </div>
                        ) : trials.length > 0 ? (
                            <>
                                {console.log('Rendering trials, count:', trials.length)}
                                <div className="grid grid-cols-1 gap-6 mb-8">
                                    {trials.map((trial) => {
                                        const primaryLocation = trial.locations[0];
                                        const locationCount = trial.locations.length;

                                        return (
                                            <div key={trial.nct_id}>
                                                <GlassCard hover className="h-full">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center space-x-3 flex-wrap gap-2">
                                                            <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full">
                                                                {trial.nct_id}
                                                            </span>
                                                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground">
                                                                {trial.phase === 'NA' || trial.phase === 'N/A' ? 'Not Applicable' : trial.phase}
                                                            </span>
                                                            <span
                                                                className={`text-xs font-semibold px-3 py-1 rounded-full ${trial.status === 'RECRUITING'
                                                                    ? 'bg-success/10 text-success'
                                                                    : 'bg-muted text-muted-foreground'
                                                                    }`}
                                                            >
                                                                {trial.status.replace(/_/g, ' ')}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                                                        {trial.title}
                                                    </h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="flex items-start space-x-2">
                                                            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                {primaryLocation && (
                                                                    <>
                                                                        <div className="font-semibold text-foreground">
                                                                            {primaryLocation.facility}
                                                                        </div>
                                                                        <div className="text-sm text-muted-foreground">
                                                                            {primaryLocation.city}, {primaryLocation.state || primaryLocation.country}
                                                                        </div>
                                                                    </>
                                                                )}
                                                                {locationCount > 1 && (
                                                                    <div className="text-xs text-muted-foreground mt-1">
                                                                        +{locationCount - 1} more location{locationCount > 2 ? 's' : ''}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start space-x-2">
                                                            <Activity className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <div className="font-semibold text-foreground">Conditions</div>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {trial.condition.slice(0, 3).map((condition, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                                                                        >
                                                                            {condition}
                                                                        </span>
                                                                    ))}
                                                                    {trial.condition.length > 3 && (
                                                                        <span className="text-xs text-muted-foreground px-2 py-1">
                                                                            +{trial.condition.length - 3} more
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Brief summary */}
                                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                        {trial.brief_summary}
                                                    </p>

                                                    <div className="flex items-center space-x-3 pt-4 border-t border-border">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleViewDetails(trial)}
                                                        >
                                                            View Details
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleCheckEligibility(trial)}
                                                        >
                                                            Check Eligibility
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleSaveTrial(trial)}
                                                            disabled={savingTrials.has(trial.nct_id)}
                                                        >
                                                            {savingTrials.has(trial.nct_id)
                                                                ? 'Saving...'
                                                                : savedTrials.has(trial.nct_id)
                                                                    ? 'Saved ✓'
                                                                    : 'Save'}
                                                        </Button>
                                                    </div>
                                                </GlassCard>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <GlassCard className="py-16 text-center">
                                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">No trials found</h3>
                                <p className="text-muted-foreground">
                                    Try adjusting your search query or filters
                                </p>
                            </GlassCard>
                        )}

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <TrialMap trials={trials} />
                )}
            </div>

            {/* Trial Details Modal */}
            <TrialDetailsModal
                trial={selectedTrial}
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
            />
        </main>
    );
}
