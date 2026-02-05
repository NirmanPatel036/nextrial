'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import BlurryBlob from '@/components/animata/background/blurry-blob';
import { Button } from '@/components/ui/Button';

export default function SignupSuccessPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background p-4">
      {/* Blurry Blob Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <BlurryBlob
          firstBlobColor="bg-primary/30"
          secondBlobColor="bg-purple-500/30"
        />
      </div>

      {/* Success Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <CheckCircle className="relative w-24 h-24 text-primary" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4"
            >
              Check Your Email
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground"
            >
              We've sent a confirmation link to
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl font-semibold text-primary mt-2"
            >
              {email}
            </motion.p>
          </div>

          {/* Email Icon Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-8 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Verify Your Email Address
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Click the confirmation link in the email to activate your account and start matching with clinical trials.
                  The link will expire in <span className="font-semibold text-primary">24 hours</span>.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4 mb-8"
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-sm font-semibold">1</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Check your inbox for an email from <span className="font-semibold text-foreground">Clinical Trial Matcher</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-sm font-semibold">2</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Click the <span className="font-semibold text-foreground">"Confirm Email Address"</span> button in the email
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-sm font-semibold">3</span>
              </div>
              <p className="text-muted-foreground text-sm">
                You'll be redirected to your dashboard to start exploring trials
              </p>
            </div>
          </motion.div>

          {/* Troubleshooting */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  Didn't receive the email?
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Check your spam folder. If you still can't find it, you can request a new confirmation email in{' '}
                  <span className="font-semibold text-primary">{timeLeft}s</span>.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              disabled={timeLeft > 0}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend Confirmation Email
            </Button>
            <Link href="/auth/login" className="flex-1">
              <Button
                className="w-full bg-white/5 hover:bg-white/10 text-foreground border border-white/10"
              >
                Back to Login
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-muted-foreground">
              Need help? Contact us at{' '}
              <a
                href="mailto:nirman0511@gmail.com"
                className="text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                nirman0511@gmail.com
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
