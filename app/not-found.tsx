'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, AlertTriangle, User2 } from 'lucide-react';
import Link from 'next/link';
import BlurryBlob from '@/components/animata/background/blurry-blob';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background p-4">
      {/* Blurry Blob Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <BlurryBlob
          firstBlobColor="bg-primary/30"
          secondBlobColor="bg-purple-500/30"
        />
      </div>

      {/* 404 Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl text-center"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <AlertTriangle className="w-24 h-24 text-primary mx-auto mb-4" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-8xl font-bold text-foreground mb-4"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-serif text-3xl font-bold text-foreground mb-4"
          >
            Page Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-muted-foreground mb-8 max-w-md mx-auto"
          >
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
                <Home className="w-5 h-5" />
                Go Back
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button className="bg-white/5 hover:bg-white/10 text-foreground border border-white/10 px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
                <User2 className="w-5 h-5" />
                Login
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
