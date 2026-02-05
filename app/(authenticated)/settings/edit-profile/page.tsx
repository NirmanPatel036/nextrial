'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Loader2, ArrowLeft, Save } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { fadeInUp } from '@/lib/animations';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

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

export default function EditProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<PatientProfile>({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
        diagnosis: '',
        stage: '',
        current_treatment: '',
        allergies: '',
    });
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
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
                    router.push('/auth/login');
                    return;
                }
                setUserId(user.id);

                const { data: profileData, error } = await supabase
                    .from('patient_profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error) {
                    console.error('Error loading profile:', error);
                    setError('Failed to load profile data');
                } else if (profileData) {
                    setProfile({
                        first_name: profileData.first_name || '',
                        last_name: profileData.last_name || '',
                        date_of_birth: profileData.date_of_birth || '',
                        phone: profileData.phone || '',
                        address: profileData.address || '',
                        city: profileData.city || '',
                        state: profileData.state || '',
                        zip_code: profileData.zip_code || '',
                        country: profileData.country || '',
                        diagnosis: profileData.diagnosis || '',
                        stage: profileData.stage || '',
                        current_treatment: profileData.current_treatment || '',
                        allergies: profileData.allergies || '',
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                setError('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [supabase, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const { error } = await supabase
                .from('patient_profiles')
                .update({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    date_of_birth: profile.date_of_birth,
                    phone: profile.phone || null,
                    address: profile.address || null,
                    city: profile.city || null,
                    state: profile.state || null,
                    zip_code: profile.zip_code || null,
                    country: profile.country || null,
                    diagnosis: profile.diagnosis || null,
                    stage: profile.stage || null,
                    current_treatment: profile.current_treatment || null,
                    allergies: profile.allergies || null,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', userId);

            if (error) {
                throw error;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/settings');
            }, 1500);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

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
                    className="mb-8"
                >
                    <button
                        onClick={() => router.push('/settings')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Settings
                    </button>
                    <div className="flex items-center space-x-3 mb-4">
                        <User className="w-8 h-8 text-primary" />
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                            Edit Profile
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground">
                        Update your personal and medical information
                    </p>
                </motion.div>

                {/* Form */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                >
                    <form onSubmit={handleSubmit}>
                        <GlassCard className="p-6 mb-6">
                            {/* Personal Information */}
                            <h2 className="text-2xl font-bold text-foreground mb-6">Personal Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="first_name" className="block text-sm font-medium text-foreground mb-2">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={profile.first_name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="last_name" className="block text-sm font-medium text-foreground mb-2">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={profile.last_name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-foreground mb-2">
                                        Date of Birth <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        value={profile.date_of_birth}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                    />
                                </div>
                            </div>

                            {/* Address Information */}
                            <h3 className="text-xl font-bold text-foreground mb-4 mt-6">Address</h3>

                            <div className="grid grid-cols-1 gap-6 mb-6">
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={profile.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={profile.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-foreground mb-2">
                                            State/Province
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={profile.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="zip_code" className="block text-sm font-medium text-foreground mb-2">
                                            ZIP/Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            id="zip_code"
                                            name="zip_code"
                                            value={profile.zip_code}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-foreground mb-2">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={profile.country}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                        />
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-6 mb-6">
                            {/* Medical Information */}
                            <h2 className="text-2xl font-bold text-foreground mb-6">Medical Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="diagnosis" className="block text-sm font-medium text-foreground mb-2">
                                        Diagnosis
                                    </label>
                                    <input
                                        type="text"
                                        id="diagnosis"
                                        name="diagnosis"
                                        value={profile.diagnosis}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="stage" className="block text-sm font-medium text-foreground mb-2">
                                        Stage
                                    </label>
                                    <input
                                        type="text"
                                        id="stage"
                                        name="stage"
                                        value={profile.stage}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="current_treatment" className="block text-sm font-medium text-foreground mb-2">
                                        Current Treatment
                                    </label>
                                    <textarea
                                        id="current_treatment"
                                        name="current_treatment"
                                        value={profile.current_treatment}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="allergies" className="block text-sm font-medium text-foreground mb-2">
                                        Known Allergies
                                    </label>
                                    <textarea
                                        id="allergies"
                                        name="allergies"
                                        value={profile.allergies}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
                                    />
                                </div>
                            </div>
                        </GlassCard>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
                                Profile updated successfully! Redirecting...
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/settings')}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </main>
    );
}
