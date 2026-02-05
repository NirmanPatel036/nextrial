import HowItWorks from '@/components/sections/HowItWorks';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'How It Works - NexTrial',
    description: 'Learn how NexTrial uses AI to match you with relevant clinical trials',
};

export default function HowItWorksPage() {
    return (
        <main className="min-h-screen pt-24">
            <HowItWorks />

            {/* Additional detailed content can be added here */}
            <section className="py-16 bg-background">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                How accurate is the AI matching?
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Our AI achieves 95% match accuracy by analyzing your complete medical profile against trial eligibility criteria using advanced RAG (Retrieval Augmented Generation) technology.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                Is my data secure?
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Yes. We are HIPAA-compliant and use industry-standard encryption to protect your medical information. Your data is never shared without your explicit consent.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                How often is trial data updated?
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We sync with ClinicalTrials.gov daily to ensure you have access to the latest trial information and recruitment status.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
