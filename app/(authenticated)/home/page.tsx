'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import {
  ImageIcon,
  BarChart3,
  Target,
  FileText,
  PenTool,
  MoreHorizontal,
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useMCP } from '@/lib/mcp-context';

interface PatientProfile {
  id?: string;
  user_id?: string;
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
  created_at?: string;
  updated_at?: string;
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [user, setUser] = useState<any>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { servers, toggleServer } = useMCP();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const rotatingTexts = [
    "Find the perfect clinical trial for you...",
    "Analyze your medical profile...",
    "Match latest research undertakings...",
    "Explore treatment innovations..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/login');
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

  const handleSubmit = () => {
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query)}`);
    }
  };

  const handleQuickAction = (queryText: string) => {
    let finalQuery = queryText;

    // If the query is about profile matching or eligibility, append profile data
    if (profile && (queryText.toLowerCase().includes('profile') || queryText.toLowerCase().includes('eligibility'))) {
      finalQuery += `\n\nMy Profile:\n`;
      if (profile.diagnosis) finalQuery += `- Diagnosis: ${profile.diagnosis}\n`;
      if (profile.stage) finalQuery += `- Stage: ${profile.stage}\n`;
      if (profile.current_treatment) finalQuery += `- Current Treatment: ${profile.current_treatment}\n`;
      if (profile.date_of_birth) {
        const age = new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear();
        finalQuery += `- Age: ${age} years\n`;
      }
      if (profile.city && profile.state) {
        finalQuery += `- Location: ${profile.city}, ${profile.state}\n`;
      }
      if (profile.allergies) finalQuery += `- Allergies: ${profile.allergies}\n`;
    }

    setQuery(finalQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickActions = [
    {
      icon: ImageIcon,
      label: 'Find cancer trials',
      color: 'text-green-500',
      query: 'Find clinical trials for cancer treatment near me',
    },
    {
      icon: BarChart3,
      label: 'Analyze eligibility',
      color: 'text-blue-500',
      query: 'Analyze my eligibility for clinical trials based on my medical profile',
    },
    {
      icon: Target,
      label: 'Match my profile',
      color: 'text-purple-500',
      query: 'Match my medical profile with available clinical trials',
    },
    {
      icon: FileText,
      label: 'Latest research',
      color: 'text-pink-500',
      query: 'Show me the latest clinical research and trial opportunities',
    },
    {
      icon: PenTool,
      label: 'Treatment options',
      color: 'text-orange-500',
      query: 'What are the available treatment options in ongoing clinical trials?',
    },
    {
      icon: MoreHorizontal,
      label: 'More queries',
      color: 'text-gray-500',
      query: null,
    },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Card Section */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl backdrop-blur-xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 pb-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="text-6xl mb-6"
            >
              🔬
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-normal text-gray-600 dark:text-gray-400 mb-2"
            >
              Hi {profile?.first_name || 'there'},
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Welcome back! How can I help?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-400 max-w-md mx-auto"
            >
              I'm here to help tackle your tasks. Choose from the prompts below or tell me what you need!
            </motion.p>
          </div>

          {/* Quick Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="px-8 pb-6"
          >
            <div className="flex flex-wrap justify-center gap-3">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  onClick={() => action.query ? handleQuickAction(action.query) : router.push('/chat')}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="px-8 pb-6"
          >
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                rows={3}
                placeholder="Ask me anything about clinical trials..."
                data-lenis-prevent
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!query.trim()}
                className="absolute bottom-4 right-3 p-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Footer Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="px-8 pb-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-4"
          >

            {/* Rotating Text */}
            <motion.div
              key={currentTextIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="flex-1 text-center mx-8"
            >
              <span className="text-gray-500 dark:text-gray-400 text-xs italic">
                {rotatingTexts[currentTextIndex]}
              </span>
            </motion.div>

            <div className="flex items-center gap-3">
              {servers.slice(0, 3).map((server) => (
                <div key={server.id} className="flex items-center gap-2">
                  <button
                    onClick={() => toggleServer(server.id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${server.enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    role="switch"
                    aria-checked={server.enabled}
                    title={server.name}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform ${server.enabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                    />
                  </button>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{server.name.split('.')[0]}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          For clinical trials trends and statistics, visit{' '}
          <a
            href="https://clinicaltrials.gov/about-site/trends-charts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            ClinicalTrials.gov Trends & Charts
          </a>
        </p>
      </footer>
    </div>
  );
}
