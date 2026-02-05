'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, Shield, Scale, Ban, CheckCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { fadeInUp } from '@/lib/animations';
import Link from 'next/link';
import Image from 'next/image';

export default function TermsOfServicePage() {
    const lastUpdated = 'February 5, 2026';

    const sections = [
        {
            icon: CheckCircle,
            title: 'Acceptance of Terms',
            content: `By accessing or using NexTrial ("Platform," "Service," "we," "us," or "our"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.

These terms constitute a legally binding agreement between you and NexTrial. We reserve the right to modify these terms at any time, and such modifications will be effective immediately upon posting. Your continued use of the Platform after changes indicates acceptance of the modified terms.`,
        },
        {
            icon: Shield,
            title: 'Eligibility and Account Registration',
            items: [
                '<strong>Age Requirement:</strong> You must be at least 18 years old to use NexTrial. By using this Platform, you represent and warrant that you meet this requirement.',
                '<strong>Account Accuracy:</strong> You agree to provide accurate, current, and complete information during registration and to update such information to maintain its accuracy.',
                '<strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.',
                '<strong>Medical Information:</strong> You certify that all health information you provide is accurate to the best of your knowledge.',
                '<strong>Healthcare Provider Consultation:</strong> You acknowledge that using NexTrial does not replace consultation with qualified healthcare professionals.',
            ],
        },
        {
            icon: FileText,
            title: 'Platform Services',
            items: [
                '<strong>Clinical Trial Matching:</strong> We provide AI-powered matching services to help you discover relevant clinical trials based on your medical profile.',
                '<strong>Information Platform:</strong> NexTrial is an informational platform. We do not conduct clinical trials, provide medical advice, or make treatment recommendations.',
                '<strong>Third-Party Trials:</strong> Clinical trials displayed on our Platform are conducted by independent sponsors and research institutions. We are not responsible for trial design, conduct, or outcomes.',
                '<strong>Accuracy of Information:</strong> While we strive for accuracy, we do not guarantee that all trial information is complete, current, or error-free. Always verify details directly with trial sponsors.',
                '<strong>Availability:</strong> We aim to maintain continuous service but do not guarantee uninterrupted access. We may modify, suspend, or discontinue services at any time.',
            ],
        },
        {
            icon: Ban,
            title: 'Prohibited Uses',
            content: 'You agree NOT to use the Platform to:',
            items: [
                'Provide false, inaccurate, or misleading information',
                'Impersonate any person or entity or misrepresent your affiliation',
                'Violate any applicable laws or regulations',
                'Interfere with or disrupt the Platform or servers',
                'Attempt to gain unauthorized access to any part of the Platform',
                'Use automated systems (bots, scrapers) without permission',
                'Transmit viruses, malware, or other harmful code',
                'Collect or harvest personal information of other users',
                'Use the Platform for any commercial purpose without authorization',
                'Abuse, harass, threaten, or intimidate other users or staff',
            ],
        },
        {
            icon: AlertTriangle,
            title: 'Medical Disclaimer',
            content: `<strong>NOT MEDICAL ADVICE:</strong> The information provided through NexTrial is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions regarding a medical condition.

<strong>NO DOCTOR-PATIENT RELATIONSHIP:</strong> Use of this Platform does not create a doctor-patient relationship between you and NexTrial or any healthcare provider.

<strong>EMERGENCY SITUATIONS:</strong> Do not use this Platform for medical emergencies. In case of emergency, call 911 or your local emergency services immediately.

<strong>TREATMENT DECISIONS:</strong> Decisions about participation in clinical trials should be made in consultation with your healthcare team. We do not recommend or endorse any specific trial, treatment, or therapy.

<strong>TRIAL ELIGIBILITY:</strong> Our matching algorithm provides suggestions based on the information you provide. Actual eligibility must be determined by the trial sponsor through their screening process.`,
        },
        {
            icon: Scale,
            title: 'Intellectual Property Rights',
            items: [
                '<strong>Platform Ownership:</strong> All content, features, functionality, and intellectual property on NexTrial are owned by us and protected by copyright, trademark, and other laws.',
                '<strong>Limited License:</strong> We grant you a limited, non-exclusive, non-transferable license to access and use the Platform for personal, non-commercial purposes.',
                '<strong>User Content:</strong> You retain ownership of information you submit but grant us a license to use it to provide services and improve our Platform.',
                '<strong>Feedback:</strong> Any suggestions, ideas, or feedback you provide may be used by us without compensation or attribution.',
                '<strong>Trademarks:</strong> "NexTrial" and associated logos are our trademarks. Unauthorized use is prohibited.',
            ],
        },
    ];

    const liabilityPoints = [
        'We provide the Platform "AS IS" and "AS AVAILABLE" without warranties of any kind',
        'We do not warrant that the Platform will be error-free, uninterrupted, or secure',
        'We are not liable for any direct, indirect, incidental, consequential, or punitive damages',
        'We are not responsible for trial outcomes, participant experiences, or medical complications',
        'We are not liable for decisions made based on information obtained through the Platform',
        'Our total liability shall not exceed the amount you paid to use the Platform (if any)',
    ];

    const indemnificationPoints = [
        'Your violation of these Terms of Service',
        'Your violation of any applicable laws or regulations',
        'Your violation of third-party rights',
        'Any claim related to your User Content',
        'Your use or misuse of the Platform',
    ];

    return (
        <>
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="border border-border/50 rounded-full my-2 px-4 py-1 glass shadow-lg">
                        <div className="flex items-center justify-between h-8">
                            <Link href="/" className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                                    <Image
                                        src="/logo.png"
                                        alt="NexTrial Logo"
                                        width={32}
                                        height={32}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <span className="font-serif text-base font-bold text-foreground">
                                    NexTrial
                                </span>
                            </Link>
                            <div className="flex items-center space-x-6">
                                <Link
                                    href="/about"
                                    className="text-sm text-foreground/80 hover:text-primary transition-colors duration-200 font-medium"
                                >
                                    About
                                </Link>
                                <Link
                                    href="/terms"
                                    className="text-sm text-primary font-medium"
                                >
                                    Terms
                                </Link>
                                <Link
                                    href="/privacy"
                                    className="text-sm text-foreground/80 hover:text-primary transition-colors duration-200 font-medium"
                                >
                                    Privacy
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="min-h-screen pt-24 pb-16 bg-background">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                            <Scale className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Please read these terms carefully before using NexTrial
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Last Updated: {lastUpdated}
                        </p>
                    </motion.div>

                    {/* Introduction */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-12"
                    >
                        <GlassCard>
                            <div className="flex items-start space-x-4">
                                <AlertTriangle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground mb-3">
                                        Important Legal Agreement
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        These Terms of Service govern your access to and use of the NexTrial platform,
                                        including our website, mobile applications, and related services. This is a
                                        legally binding contract. By using NexTrial, you acknowledge that you have read,
                                        understood, and agree to be bound by these terms.
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Main Sections */}
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: idx * 0.1 }}
                            className="mb-8"
                        >
                            <GlassCard>
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <section.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                                </div>
                                {section.content && (
                                    <div
                                        className="text-muted-foreground leading-relaxed whitespace-pre-line mb-4"
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                    />
                                )}
                                {section.items && (
                                    <ul className="space-y-3">
                                        {section.items.map((item, itemIdx) => (
                                            <li key={itemIdx} className="flex items-start space-x-3">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                                <span
                                                    className="text-muted-foreground leading-relaxed"
                                                    dangerouslySetInnerHTML={{ __html: item }}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </GlassCard>
                        </motion.div>
                    ))}

                    {/* Limitation of Liability */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-8"
                    >
                        <GlassCard>
                            <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
                            <p className="text-muted-foreground mb-4">
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                            </p>
                            <ul className="space-y-3 mb-6">
                                {liabilityPoints.map((point, idx) => (
                                    <li key={idx} className="flex items-start space-x-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                        <span className="text-muted-foreground leading-relaxed">{point}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <p className="text-sm text-foreground">
                                    <strong>IMPORTANT:</strong> Some jurisdictions do not allow limitations on implied
                                    warranties or liability for incidental or consequential damages. In such jurisdictions,
                                    our liability is limited to the greatest extent permitted by law.
                                </p>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Indemnification */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-8"
                    >
                        <GlassCard>
                            <h2 className="text-2xl font-bold text-foreground mb-4">Indemnification</h2>
                            <p className="text-muted-foreground mb-4">
                                You agree to defend, indemnify, and hold harmless NexTrial, its affiliates, officers,
                                directors, employees, and agents from any claims, liabilities, damages, losses, costs,
                                or expenses (including reasonable attorneys' fees) arising from:
                            </p>
                            <ul className="space-y-3">
                                {indemnificationPoints.map((point, idx) => (
                                    <li key={idx} className="flex items-start space-x-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                        <span className="text-muted-foreground leading-relaxed">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </GlassCard>
                    </motion.div>

                    {/* Privacy and Data Protection */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-8"
                    >
                        <GlassCard>
                            <h2 className="text-2xl font-bold text-foreground mb-4">Privacy and Data Protection</h2>
                            <p className="text-muted-foreground mb-4">
                                Your privacy is important to us. Our collection, use, and disclosure of your personal
                                information is governed by our Privacy Policy, which is incorporated into these Terms
                                by reference.
                            </p>
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                <p className="text-sm text-muted-foreground mb-2">
                                    By using NexTrial, you also agree to our:
                                </p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                        <Link href="/privacy" className="text-primary hover:underline">
                                            Privacy Policy
                                        </Link>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span className="text-muted-foreground">HIPAA Authorization (for PHI)</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span className="text-muted-foreground">Data Processing Agreement</span>
                                    </li>
                                </ul>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Termination */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-8"
                    >
                        <GlassCard>
                            <h2 className="text-2xl font-bold text-foreground mb-4">Account Termination</h2>
                            <div className="space-y-4 text-muted-foreground">
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Your Right to Terminate</h3>
                                    <p>
                                        You may terminate your account at any time through your account settings or by
                                        contacting us. Upon termination, your account will be deactivated, and your
                                        personal health information will be deleted in accordance with our Privacy Policy
                                        and applicable laws.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Our Right to Terminate</h3>
                                    <p>
                                        We reserve the right to suspend or terminate your account immediately, without
                                        prior notice, if you violate these Terms, engage in fraudulent activity, or for
                                        any other reason we deem appropriate. We are not liable for any consequences
                                        resulting from termination.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Effect of Termination</h3>
                                    <p>
                                        Upon termination, your right to use the Platform ceases immediately. Provisions
                                        that should reasonably survive termination (including limitations of liability,
                                        indemnification, and dispute resolution) will remain in effect.
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Dispute Resolution */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-8"
                    >
                        <GlassCard>
                            <h2 className="text-2xl font-bold text-foreground mb-4">Dispute Resolution</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Informal Resolution</h3>
                                    <p className="text-muted-foreground">
                                        If you have any dispute with us, you agree to first contact us at{' '}
                                        <a href="mailto:legal@nextrial.com" className="text-primary hover:underline">
                                            legal@nextrial.com
                                        </a>{' '}
                                        to attempt to resolve the dispute informally. We will work in good faith to
                                        resolve the issue within 30 days.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Arbitration Agreement</h3>
                                    <p className="text-muted-foreground mb-3">
                                        If informal resolution fails, you agree that any dispute will be resolved through
                                        binding arbitration rather than in court, except for:
                                    </p>
                                    <ul className="space-y-2 text-muted-foreground">
                                        <li className="flex items-start space-x-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                            <span>Claims in small claims court</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                            <span>Claims seeking injunctive relief</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                            <span>Intellectual property disputes</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Class Action Waiver</h3>
                                    <p className="text-muted-foreground">
                                        You agree to bring claims against us only in your individual capacity and not as
                                        part of any class or representative action.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Governing Law</h3>
                                    <p className="text-muted-foreground">
                                        These Terms are governed by the laws of [Your Jurisdiction], without regard to
                                        conflict of law principles.
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* General Provisions */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-8"
                    >
                        <GlassCard>
                            <h2 className="text-2xl font-bold text-foreground mb-4">General Provisions</h2>
                            <div className="space-y-4 text-muted-foreground">
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Entire Agreement</h3>
                                    <p>
                                        These Terms, together with our Privacy Policy, constitute the entire agreement
                                        between you and NexTrial regarding the use of the Platform.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Severability</h3>
                                    <p>
                                        If any provision of these Terms is found to be unenforceable, the remaining
                                        provisions will remain in full force and effect.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Waiver</h3>
                                    <p>
                                        Our failure to enforce any right or provision of these Terms will not be
                                        considered a waiver of those rights.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Assignment</h3>
                                    <p>
                                        You may not assign or transfer these Terms without our written consent. We may
                                        assign our rights and obligations without restriction.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Force Majeure</h3>
                                    <p>
                                        We are not liable for any failure or delay in performance due to circumstances
                                        beyond our reasonable control.
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-8"
                    >
                        <GlassCard>
                            <h2 className="text-2xl font-bold text-foreground mb-4">Questions About These Terms?</h2>
                            <p className="text-muted-foreground mb-4">
                                If you have any questions or concerns about these Terms of Service, please contact us:
                            </p>
                            <div className="space-y-3 text-muted-foreground">
                                <div className="flex items-start space-x-3">
                                    <span className="font-semibold text-foreground w-24">Legal:</span>
                                    <a href="mailto:nirman0511@gmail.com" className="text-primary hover:underline">
                                        nirman0511@gmail.com
                                    </a>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Acknowledgment */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="text-center"
                    >
                        <div className="p-6 rounded-lg bg-primary/5 border border-primary/10">
                            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                            <p className="text-foreground font-semibold mb-2">
                                By using NexTrial, you acknowledge that you have read these Terms of Service and agree
                                to be bound by them.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Last updated: {lastUpdated}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>
        </>
    );
}
