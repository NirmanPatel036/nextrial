'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, FileText, AlertCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { fadeInUp } from '@/lib/animations';
import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPolicyPage() {
    const lastUpdated = 'February 5, 2026';

    const sections = [
        {
            icon: Eye,
            title: 'Information We Collect',
            content: [
                {
                    subtitle: 'Personal Information',
                    items: [
                        'Name, email address, phone number, and date of birth',
                        'Physical address and location information',
                        'Account credentials and authentication data',
                    ],
                },
                {
                    subtitle: 'Health Information (Protected Health Information - PHI)',
                    items: [
                        'Medical diagnosis and disease stage',
                        'Current treatments and medications',
                        'Known allergies and medical conditions',
                        'Medical history relevant to clinical trial eligibility',
                        'Laboratory results and test data (when provided)',
                    ],
                },
                {
                    subtitle: 'Technical Information',
                    items: [
                        'Device information (browser type, operating system)',
                        'IP address and location data',
                        'Usage data and interaction patterns',
                        'Cookies and similar tracking technologies',
                    ],
                },
            ],
        },
        {
            icon: Lock,
            title: 'How We Use Your Information',
            content: [
                {
                    subtitle: 'Primary Purposes',
                    items: [
                        'Match you with relevant clinical trials based on your medical profile',
                        'Process and respond to your inquiries and requests',
                        'Provide personalized recommendations using AI analysis',
                        'Communicate with you about trial opportunities and updates',
                        'Maintain and improve our services and user experience',
                    ],
                },
                {
                    subtitle: 'Secondary Purposes',
                    items: [
                        'Analyze usage patterns to improve platform functionality',
                        'Conduct research to enhance our matching algorithms',
                        'Comply with legal obligations and prevent fraud',
                        'Protect the security and integrity of our platform',
                    ],
                },
            ],
        },
        {
            icon: Database,
            title: 'How We Protect Your Information',
            content: [
                {
                    subtitle: 'Security Measures',
                    items: [
                        'AES-256 bit encryption for data at rest and in transit',
                        'HIPAA-compliant infrastructure hosted on secure servers',
                        'Multi-factor authentication and secure access controls',
                        'Regular security audits and penetration testing',
                        'Automated backup systems with disaster recovery protocols',
                        'Employee training on data privacy and HIPAA compliance',
                    ],
                },
                {
                    subtitle: 'Access Controls',
                    items: [
                        'Role-based access control (RBAC) for system administrators',
                        'Audit logs tracking all data access and modifications',
                        'Automatic session timeouts and secure logout procedures',
                        'Network segmentation and firewall protection',
                    ],
                },
            ],
        },
        {
            icon: FileText,
            title: 'Information Sharing and Disclosure',
            content: [
                {
                    subtitle: 'We May Share Your Information With:',
                    items: [
                        '<strong>Clinical Trial Sponsors:</strong> When you express interest in a trial, we may share relevant eligibility information with the trial sponsor or research site (with your explicit consent)',
                        '<strong>Healthcare Providers:</strong> With your authorization, we may share information with your healthcare team',
                        '<strong>Service Providers:</strong> Trusted third-party vendors who help us operate our platform (all bound by strict confidentiality agreements)',
                        '<strong>Legal Requirements:</strong> When required by law, court order, or government regulation',
                        '<strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with continued privacy protection)',
                    ],
                },
                {
                    subtitle: 'We Will NEVER:',
                    items: [
                        'Sell your personal health information to third parties',
                        'Share your data for marketing purposes without consent',
                        'Use your information for purposes incompatible with this policy',
                        'Disclose your PHI without proper authorization or legal basis',
                    ],
                },
            ],
        },
    ];

    const rights = [
        {
            title: 'Access Your Data',
            description: 'Request a copy of all personal information we have about you',
        },
        {
            title: 'Correct Your Data',
            description: 'Update or correct inaccurate or incomplete information',
        },
        {
            title: 'Delete Your Data',
            description: 'Request deletion of your account and associated data (subject to legal retention requirements)',
        },
        {
            title: 'Export Your Data',
            description: 'Receive your data in a portable, machine-readable format',
        },
        {
            title: 'Restrict Processing',
            description: 'Limit how we process your personal information',
        },
        {
            title: 'Withdraw Consent',
            description: 'Revoke consent for data processing at any time',
        },
        {
            title: 'Object to Processing',
            description: 'Object to certain types of data processing activities',
        },
        {
            title: 'File a Complaint',
            description: 'Lodge a complaint with relevant data protection authorities',
        },
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
                                    className="text-sm text-foreground/80 hover:text-primary transition-colors duration-200 font-medium"
                                >
                                    Terms
                                </Link>
                                <Link
                                    href="/privacy"
                                    className="text-sm text-primary font-medium"
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
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Your privacy and the security of your health information is our top priority
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
                                <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground mb-3">
                                        Our Commitment to Your Privacy
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed mb-3">
                                        NexTrial ("we," "our," or "us") is committed to protecting your privacy and ensuring
                                        the security of your personal health information. This Privacy Policy explains how we
                                        collect, use, disclose, and safeguard your information when you use our clinical trial
                                        matching platform.
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed mb-3">
                                        We comply with the Health Insurance Portability and Accountability Act (HIPAA), the
                                        General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA),
                                        and other applicable data protection laws.
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed">
                                        By using NexTrial, you consent to the data practices described in this policy. If you
                                        do not agree with this policy, please do not use our services.
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
                                {section.content.map((subsection, subIdx) => (
                                    <div key={subIdx} className={subIdx > 0 ? 'mt-6' : ''}>
                                        {subsection.subtitle && (
                                            <h3 className="text-lg font-semibold text-foreground mb-3">
                                                {subsection.subtitle}
                                            </h3>
                                        )}
                                        <ul className="space-y-2">
                                            {subsection.items.map((item, itemIdx) => (
                                                <li key={itemIdx} className="flex items-start space-x-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                                    <span
                                                        className="text-muted-foreground leading-relaxed"
                                                        dangerouslySetInnerHTML={{ __html: item }}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </GlassCard>
                        </motion.div>
                    ))}

                    {/* Your Rights */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-8"
                    >
                        <GlassCard>
                            <h2 className="text-2xl font-bold text-foreground mb-6">Your Privacy Rights</h2>
                            <p className="text-muted-foreground mb-6">
                                Under applicable privacy laws (including HIPAA, GDPR, and CCPA), you have the following rights:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {rights.map((right, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-lg bg-primary/5 border border-primary/10"
                                    >
                                        <h3 className="font-semibold text-foreground mb-2">{right.title}</h3>
                                        <p className="text-sm text-muted-foreground">{right.description}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-muted-foreground mt-6">
                                To exercise any of these rights, please contact us at{' '}
                                <a href="mailto:privacy@nextrial.com" className="text-primary hover:underline">
                                    privacy@nextrial.com
                                </a>{' '}
                                or visit your account settings.
                            </p>
                        </GlassCard>
                    </motion.div>

                    {/* Data Retention */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-8"
                    >
                        <GlassCard>
                            <h2 className="text-2xl font-bold text-foreground mb-4">Data Retention</h2>
                            <div className="space-y-3 text-muted-foreground">
                                <p>
                                    We retain your personal information for as long as necessary to provide our services
                                    and fulfill the purposes outlined in this policy, unless a longer retention period
                                    is required by law.
                                </p>
                                <ul className="space-y-2 ml-4">
                                    <li className="flex items-start space-x-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                        <span><strong>Active Accounts:</strong> Retained while your account is active</span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                        <span><strong>Deleted Accounts:</strong> PHI deleted within 30 days; anonymized data may be retained for research</span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                        <span><strong>Legal Requirements:</strong> Some data retained longer to comply with legal obligations</span>
                                    </li>
                                </ul>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* International Data Transfers */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-8"
                    >
                        <GlassCard>
                            <h2 className="text-2xl font-bold text-foreground mb-4">International Data Transfers</h2>
                            <p className="text-muted-foreground mb-3">
                                Your information may be transferred to and maintained on servers located outside your
                                country of residence. We ensure that all international data transfers comply with
                                applicable data protection laws through:
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-start space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span>Standard Contractual Clauses approved by the European Commission</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span>Data Processing Agreements with all service providers</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span>Adherence to Privacy Shield principles (where applicable)</span>
                                </li>
                            </ul>
                        </GlassCard>
                    </motion.div>

                    {/* Children's Privacy */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-8"
                    >
                        <GlassCard>
                            <h2 className="text-2xl font-bold text-foreground mb-4">Children's Privacy</h2>
                            <p className="text-muted-foreground">
                                NexTrial is not intended for use by individuals under the age of 18. We do not knowingly
                                collect personal information from children. If you are a parent or guardian and believe
                                your child has provided us with personal information, please contact us immediately, and
                                we will delete such information.
                            </p>
                        </GlassCard>
                    </motion.div>

                    {/* Cookies and Tracking */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-8"
                    >
                        <GlassCard>
                            <h2 className="text-2xl font-bold text-foreground mb-4">Cookies and Tracking Technologies</h2>
                            <p className="text-muted-foreground mb-4">
                                We use cookies and similar tracking technologies to enhance your experience. These include:
                            </p>
                            <div className="space-y-3">
                                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                    <h3 className="font-semibold text-foreground mb-2">Essential Cookies</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Required for the platform to function (authentication, security, session management)
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                    <h3 className="font-semibold text-foreground mb-2">Analytics Cookies</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Help us understand how you use our platform to improve functionality
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                    <h3 className="font-semibold text-foreground mb-2">Preference Cookies</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Remember your settings and preferences for a better experience
                                    </p>
                                </div>
                            </div>
                            <p className="text-muted-foreground mt-4">
                                You can control cookies through your browser settings. Note that disabling essential cookies
                                may affect platform functionality.
                            </p>
                        </GlassCard>
                    </motion.div>

                    {/* Changes to Policy */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-8"
                    >
                        <GlassCard>
                            <h2 className="text-2xl font-bold text-foreground mb-4">Changes to This Privacy Policy</h2>
                            <p className="text-muted-foreground mb-3">
                                We may update this Privacy Policy from time to time to reflect changes in our practices,
                                technology, legal requirements, or other factors. We will notify you of any material changes
                                by:
                            </p>
                            <ul className="space-y-2 text-muted-foreground mb-3">
                                <li className="flex items-start space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span>Posting the updated policy on our website with a new "Last Updated" date</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span>Sending you an email notification (if you have an account)</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span>Displaying a prominent notice on our platform</span>
                                </li>
                            </ul>
                            <p className="text-muted-foreground">
                                Your continued use of NexTrial after any changes indicates your acceptance of the updated policy.
                            </p>
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
                            <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
                            <p className="text-muted-foreground mb-4">
                                If you have any questions, concerns, or requests regarding this Privacy Policy or our
                                data practices, please contact us:
                            </p>
                            <div className="space-y-3 text-muted-foreground">
                                <div className="flex items-start space-x-3">
                                    <span className="font-semibold text-foreground w-24">Support:</span>
                                    <a href="mailto:nirman0511@gmail.com" className="text-primary hover:underline">
                                        nirman0511@gmail.com
                                    </a>
                                </div>
                            </div>
                            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
                                <p className="text-sm text-foreground font-semibold mb-2">
                                    Address
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    NexTrial Privacy<br />
                                    62/1A, Mahindra University<br />
                                    Bahadurpally, Jeedimetla<br />
                                    Hyderabad, Telangana 500043
                                </p>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Compliance Badges */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="text-center"
                    >
                        <div className="flex flex-wrap justify-center gap-6 items-center">
                            <div className="px-6 py-3 rounded-lg bg-primary/5 border border-primary/10">
                                <p className="text-xs text-muted-foreground mb-1">Compliant with</p>
                                <p className="font-semibold text-foreground">HIPAA</p>
                            </div>
                            <div className="px-6 py-3 rounded-lg bg-primary/5 border border-primary/10">
                                <p className="text-xs text-muted-foreground mb-1">Compliant with</p>
                                <p className="font-semibold text-foreground">GDPR</p>
                            </div>
                            <div className="px-6 py-3 rounded-lg bg-primary/5 border border-primary/10">
                                <p className="text-xs text-muted-foreground mb-1">Compliant with</p>
                                <p className="font-semibold text-foreground">CCPA</p>
                            </div>
                            <div className="px-6 py-3 rounded-lg bg-primary/5 border border-primary/10">
                                <p className="text-xs text-muted-foreground mb-1">Standard</p>
                                <p className="font-semibold text-foreground">FHIR R4</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </>
    );
}
