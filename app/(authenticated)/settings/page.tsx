'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, FileText, Pill, Settings as SettingsIcon, User, Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useMCP } from '@/lib/mcp-context';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Footer from '@/components/layout/Footer';

interface PatientProfile {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    diagnosis?: string;
    stage?: string;
    current_treatment?: string;
    allergies?: string;
}

export default function SettingsPage() {
    const { servers, toggleServer } = useMCP();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<PatientProfile | null>(null);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    window.location.href = '/auth/login';
                    return;
                }
                setUser(user);

                const { data: profileData, error } = await supabase
                    .from('patient_profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error) {
                    console.error('Error loading profile:', error);
                } else {
                    setProfile(profileData);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [supabase, router]);

    const mcpIntegrations = [
        {
            id: 'clinicaltrials',
            name: 'ClinicalTrials.gov',
            icon: Database,
            description: 'Access to 400,000+ clinical trials from the official U.S. database',
            features: ['Trial eligibility criteria', 'Recruitment status', 'Location data', 'Contact information'],
        },
        {
            id: 'pubmed',
            name: 'PubMed',
            icon: FileText,
            description: 'Medical literature and research papers from NCBI',
            features: ['Research articles', 'Clinical studies', 'Medical evidence', 'Treatment outcomes'],
        },
        {
            id: 'rxnorm',
            name: 'RxNorm',
            icon: Pill,
            description: 'Standardized drug naming and medication information',
            features: ['Drug standardization', 'Medication matching', 'Dosage information', 'Drug interactions'],
        },
    ];

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <main className="pt-24 pb-16" data-lenis-prevent>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="mb-12"
                >
                    <div className="flex items-center space-x-3 mb-4">
                        <SettingsIcon className="w-8 h-8 text-primary" />
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                            Settings
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground">
                        Manage your profile and configure data sources
                    </p>
                </motion.div>

                {/* Profile Information Section */}
                {profile && (
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <User className="w-6 h-6" />
                            Profile Information
                        </h2>
                        <GlassCard className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Info */}
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                                    <p className="text-foreground font-medium text-lg">
                                        {profile.first_name} {profile.last_name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                                    <p className="text-foreground font-medium text-lg">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Date of Birth</p>
                                    <p className="text-foreground font-medium text-lg">
                                        {new Date(profile.date_of_birth).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                {profile.phone && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Phone</p>
                                        <p className="text-foreground font-medium text-lg">{profile.phone}</p>
                                    </div>
                                )}

                                {/* Address Info */}
                                {(profile.address || profile.city) && (
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-muted-foreground mb-1">Address</p>
                                        <p className="text-foreground font-medium text-lg">
                                            {[profile.address, profile.city, profile.state, profile.zip_code, profile.country]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </p>
                                    </div>
                                )}

                                {/* Medical Info */}
                                {profile.diagnosis && (
                                    <>
                                        <div className="md:col-span-2 border-t border-border pt-6 mt-2">
                                            <h3 className="text-lg font-semibold text-foreground mb-4">Medical Information</h3>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Diagnosis</p>
                                            <p className="text-foreground font-medium text-lg">{profile.diagnosis}</p>
                                        </div>
                                    </>
                                )}
                                {profile.stage && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Stage</p>
                                        <p className="text-foreground font-medium text-lg">{profile.stage}</p>
                                    </div>
                                )}
                                {profile.current_treatment && (
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-muted-foreground mb-1">Current Treatment</p>
                                        <p className="text-foreground font-medium text-lg">{profile.current_treatment}</p>
                                    </div>
                                )}
                                {profile.allergies && (
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-muted-foreground mb-1">Known Allergies</p>
                                        <p className="text-foreground font-medium text-lg">{profile.allergies}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-border">
                                <Button
                                    variant="outline"
                                    className="w-full md:w-auto"
                                    onClick={() => window.location.href = '/settings/edit-profile'}
                                >
                                    Edit Profile
                                </Button>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}

                {/* MCP Server Configuration */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                        External Data Sources
                    </h2>

                    {mcpIntegrations.map((integration, index) => {
                        const server = servers.find((s) => s.id === integration.id);
                        const isEnabled = server?.enabled ?? true;

                        return (
                            <motion.div key={integration.id} variants={staggerItem}>
                                <GlassCard className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start space-x-4">
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isEnabled ? 'bg-primary/10' : 'bg-muted'
                                                    }`}
                                            >
                                                <integration.icon
                                                    className={`w-6 h-6 transition-colors ${isEnabled ? 'text-primary' : 'text-muted-foreground'
                                                        }`}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-foreground mb-2">
                                                    {integration.name}
                                                </h3>
                                                <p className="text-muted-foreground mb-4">
                                                    {integration.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {integration.features.map((feature, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full"
                                                        >
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Toggle Switch */}
                                        <button
                                            onClick={() => toggleServer(integration.id)}
                                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isEnabled ? 'bg-primary' : 'bg-muted'
                                                }`}
                                            role="switch"
                                            aria-checked={isEnabled}
                                            aria-label={`Toggle ${integration.name}`}
                                        >
                                            <span
                                                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${isEnabled ? 'translate-x-7' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div
                                        className={`pt-4 border-t border-border transition-opacity ${isEnabled ? 'opacity-100' : 'opacity-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                {isEnabled ? 'Active' : 'Disabled'}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {isEnabled
                                                    ? 'This data source will be used in searches'
                                                    : 'This data source will be excluded from searches'}
                                            </span>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Info Box */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="mt-12"
                >
                    <GlassCard className="bg-primary/5 border-primary/20">
                        <h3 className="font-bold text-foreground mb-2">How This Works</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            When you search for clinical trials, NexTrial queries the enabled data sources to find the most relevant matches. Disabling a source will exclude it from your searches, which may reduce the number of results but can be useful if you want to focus on specific types of information.
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your preferences are saved automatically and will persist across sessions.
                        </p>
                    </GlassCard>
                </motion.div>

                {/* Active Sources Summary */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="mt-8 text-center"
                >
                    <p className="text-sm text-muted-foreground">
                        Currently active:{' '}
                        <span className="font-semibold text-foreground">
                            {servers.filter((s) => s.enabled).length} of {servers.length} data sources
                        </span>
                    </p>
                </motion.div>
            </div>
            <div className="mt-16 -mb-16">
                <Footer />
            </div>
        </main>
    );
}
