'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, FileText, Database, Loader2, Network, DatabaseZap, User, Bot, Copy, Check, Map as MapIcon, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import { searchTrials, type SearchResponse } from '@/lib/api-client';
import { Trial } from '@/lib/types';
import { extractAndGeocodeLocations, parseTrialLocationsFromResponse } from '@/lib/location-extractor';
import { createConversation, saveMessage, getMessages, generateConversationTitle, type Conversation } from '@/lib/conversations';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import SourcesModal from '@/components/ui/SourcesModal';
import Image from 'next/image';

// Dynamically import TrialMap to avoid SSR issues with Mapbox
const TrialMap = dynamic(() => import('@/components/ui/TrialMap'), {
    ssr: false,
    loading: () => (
        <GlassCard className="h-full flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading map...</p>
            </div>
        </GlassCard>
    ),
});

// Typing dots animation component
const TypingDots = () => (
    <div className="inline-flex space-x-1 items-center h-4">
        <motion.span
            className="w-2 h-2 bg-current rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
            className="w-2 h-2 bg-current rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.span
            className="w-2 h-2 bg-current rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
    </div>
);

interface Message {
    role: 'user' | 'assistant';
    content?: string;
    sources?: Array<{
        type: string;
        id: string;
        relevance: string;
    }>;
    isGenerating?: boolean;
    confidence?: string;
    total_results?: number;
    processing_time?: number;
}

function ChatPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const conversationIdParam = searchParams.get('conversation');

    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content:
                "Hello! I'm your AI assistant for clinical trial matching. I can help you find trials, answer questions about eligibility, and provide information about specific studies. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [enableMCP, setEnableMCP] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
    const [currentTrials, setCurrentTrials] = useState<Trial[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [sourcesModalOpen, setSourcesModalOpen] = useState(false);
    const [selectedSources, setSelectedSources] = useState<Array<{ type: string; id: string; relevance: string }>>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const hasAutoSubmitted = useRef(false); // Track if we've already auto-submitted
    const lastAutoSubmittedQuery = useRef<string | null>(null); // Track the last query we auto-submitted
    const isHandlingSend = useRef(false); // Track if handleSend is currently running
    const hasLoadedConversation = useRef(false); // Track if we've loaded the conversation to prevent reloading

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const questionCategories = [
        {
            title: 'Search by Condition',
            description: 'Find trials for specific diseases',
            questions: [
                'Find breast cancer trials in Boston',
                'Show me lung cancer clinical trials',
                'What melanoma trials are available?',
                'Find diabetes type 2 trials near me',
                'Search for Alzheimer\'s disease studies',
                'Show trials for rheumatoid arthritis'
            ]
        },
        {
            title: 'Filter by Phase',
            description: 'Search by trial phase and stage',
            questions: [
                'What are Phase 3 trials for lung cancer?',
                'Show Phase 1 and Phase 2 breast cancer trials',
                'Find early phase trials for melanoma',
                'List all Phase 4 cardiovascular trials',
                'Show Phase 2/3 diabetes trials'
            ]
        },
        {
            title: 'Location-Based',
            description: 'Find trials by location',
            questions: [
                'Find clinical trials in New York',
                'Show trials in California hospitals',
                'What trials are available in Boston area?',
                'Find trials near zip code 02115',
                'Show trials in major medical centers'
            ]
        },
        {
            title: 'Eligibility Questions',
            description: 'Ask about trial requirements',
            questions: [
                'What are the eligibility criteria for breast cancer trials?',
                'Can children participate in diabetes trials?',
                'Age requirements for Alzheimer\'s trials',
                'Do I qualify for this trial?',
                'What medical history is required?'
            ]
        },
        {
            title: 'Trial Details',
            description: 'Get specific trial information',
            questions: [
                'What is the treatment protocol?',
                'How long does the trial last?',
                'What are the potential side effects?',
                'Is compensation provided for participants?',
                'What follow-up care is included?'
            ]
        },
        {
            title: 'Advanced Queries',
            description: 'Complex search queries',
            questions: [
                'Compare Phase 2 and Phase 3 immunotherapy trials',
                'Find trials with specific biomarker requirements',
                'Show trials recruiting in the next 30 days',
                'What trials accept patients with comorbidities?',
                'Find trials with specific drug combinations'
            ]
        }
    ];

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
            }
        };
        loadUser();
    }, [supabase]);

    // Load conversation if conversation ID is in URL
    useEffect(() => {
        if (!conversationIdParam || !userId) return;

        // Only load conversation once to prevent wiping out messages during handleSend
        if (hasLoadedConversation.current) return;

        const loadConversation = async () => {
            try {
                const conversationMessages = await getMessages(conversationIdParam);
                if (conversationMessages.length > 0) {
                    // Convert database messages to UI messages with validation
                    const uiMessages: Message[] = conversationMessages
                        .filter(msg => msg && msg.role && msg.content) // Filter out invalid messages
                        .map(msg => ({
                            role: msg.role,
                            content: msg.content,
                            ...(msg.metadata || {}) // Safely spread metadata, default to empty object
                        }));

                    // Only update if we have valid messages
                    if (uiMessages.length > 0) {
                        setMessages(uiMessages);
                        hasLoadedConversation.current = true; // Mark as loaded
                    }
                }
            } catch (error) {
                console.error('Error loading conversation:', error);
                // Reset to default welcome message on error
                setMessages([
                    {
                        role: 'assistant',
                        content: "Hello! I'm your AI assistant for clinical trial matching. I can help you find trials, answer questions about eligibility, and provide information about specific studies. How can I help you today?",
                    },
                ]);
            }
        };

        loadConversation();
    }, [conversationIdParam, userId]);

    // Handle URL query parameter for auto-submission
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const queryParam = params.get('q');
        const conversationParam = params.get('conversation');

        // Don't auto-submit if we're loading a conversation
        if (conversationParam) return;

        // Check if this is a new query (different from the last auto-submitted one)
        const isNewQuery = queryParam && queryParam !== lastAutoSubmittedQuery.current;

        if (isNewQuery && !isLoading) {
            // Reset the flag for this new query
            hasAutoSubmitted.current = false;
        }

        // Prevent duplicate submissions of the same query
        if (hasAutoSubmitted.current) return;

        if (queryParam && !isLoading) {
            // Mark that we're auto-submitting this query
            hasAutoSubmitted.current = true;
            lastAutoSubmittedQuery.current = queryParam;

            // Only auto-submit if we have a query and haven't already started processing
            setInput(queryParam);

            // Auto-submit after a brief delay to ensure state is updated
            setTimeout(() => {
                const userMessage: Message = { role: 'user', content: queryParam };
                const assistantMessage: Message = {
                    role: 'assistant',
                    isGenerating: true,
                };

                // Add both messages and start processing immediately
                setMessages((prev) => {
                    const newMessages = [...prev, userMessage, assistantMessage];
                    return newMessages;
                });
                setIsLoading(true);

                // Start search immediately without nested setTimeout
                searchTrials({
                    query: queryParam,
                    n_results: 10,
                    similarity_threshold: enableMCP ? 0.3 : 0.2,
                })
                    .then((response: SearchResponse) => {
                        const sources: Array<{ type: string; id: string; relevance: string }> = [];

                        if (response.sources?.vector_db) {
                            response.sources.vector_db.forEach((src: any) => {
                                sources.push({
                                    type: src.type || 'Trial',
                                    id: src.trial_id || 'Unknown',
                                    relevance: src.relevance || 'N/A',
                                });
                            });
                        }

                        setMessages((prev) => {
                            const newMessages = [...prev];
                            // Use prev.length - 1 to get the last message (assistant)
                            const actualIndex = prev.length - 1;
                            newMessages[actualIndex] = {
                                role: 'assistant',
                                sources: sources,
                                confidence: response.confidence,
                                total_results: response.total_results,
                                processing_time: response.processing_time,
                                isGenerating: true,
                            };
                            return newMessages;
                        });

                        // Update map trials
                        try {
                            const mappedTrials: Trial[] = [];
                            const structuredTrials = parseTrialLocationsFromResponse(response);

                            if (structuredTrials.length > 0) {
                                structuredTrials.forEach(trial => {
                                    mappedTrials.push({
                                        nct_id: trial.nct_id,
                                        title: trial.title,
                                        official_title: trial.title,
                                        status: 'RECRUITING',
                                        phase: 'N/A',
                                        condition: [],
                                        eligibility_criteria: '',
                                        min_age: '',
                                        max_age: '',
                                        gender: 'ALL',
                                        brief_summary: '',
                                        interventions: [],
                                        locations: trial.locations
                                    });
                                });

                                setCurrentTrials(mappedTrials);
                            } else {
                                extractAndGeocodeLocations(response.answer)
                                    .then(geocodedLocations => {
                                        if (geocodedLocations.length > 0) {
                                            const extractedTrials: Trial[] = geocodedLocations.map((loc, idx) => ({
                                                nct_id: `EXTRACTED-${idx}`,
                                                title: `Trial near ${loc.place_name || loc.name}`,
                                                official_title: `Clinical Trial - ${loc.place_name || loc.name}`,
                                                status: 'RECRUITING',
                                                phase: 'N/A',
                                                condition: [],
                                                eligibility_criteria: '',
                                                min_age: '',
                                                max_age: '',
                                                gender: 'ALL',
                                                brief_summary: `Location mentioned in search results: ${loc.context || loc.name}`,
                                                interventions: [],
                                                locations: [{
                                                    facility: loc.place_name || loc.name,
                                                    city: loc.name.split(',')[0] || '',
                                                    state: loc.context?.split(',')[0] || '',
                                                    country: 'USA'
                                                }],
                                                _geocoded: {
                                                    lng: loc.coordinates[0],
                                                    lat: loc.coordinates[1],
                                                    confidence: loc.confidence
                                                }
                                            }));

                                            setCurrentTrials(extractedTrials);
                                        } else {
                                            setCurrentTrials([]);
                                        }
                                    })
                                    .catch(() => setCurrentTrials([]));
                            }
                        } catch (extractionError) {
                            console.error('Location extraction error:', extractionError);
                            setCurrentTrials([]);
                        }

                        // Stream the response text
                        return streamText(response.answer, -1); // -1 will be handled in streamText
                    })
                    .catch((error) => {
                        console.error('Search error:', error);
                        setMessages((prev) => {
                            const newMessages = [...prev];
                            const actualIndex = prev.length - 1; // Last message is the assistant
                            newMessages[actualIndex] = {
                                role: 'assistant',
                                content: `Error: ${error instanceof Error ? error.message : 'Failed to search trials'}. Please try again.`,
                                confidence: 'error',
                                isGenerating: false,
                            };
                            return newMessages;
                        });
                    })
                    .finally(() => {
                        setIsLoading(false);
                        // Clear the query parameter from URL
                        window.history.replaceState({}, '', '/chat');
                    });
            }, 100);
        }
    }, []); // Empty dependency array - only run once on mount

    // Typing effect for assistant messages
    const streamText = async (text: string, messageIndex: number) => {
        // Small delay to ensure typing dots are visible
        await new Promise((resolve) => setTimeout(resolve, 300));

        const words = text.split(' ');
        let currentText = '';

        for (let i = 0; i < words.length; i++) {
            currentText += (i > 0 ? ' ' : '') + words[i];

            // Only update state if we have content to show
            if (currentText.trim().length > 0) {
                setMessages((prev) => {
                    const newMessages = [...prev];
                    // If messageIndex is -1, find the last assistant message
                    const targetIndex = messageIndex === -1 ? prev.length - 1 : messageIndex;
                    if (newMessages[targetIndex]) {
                        newMessages[targetIndex] = {
                            ...newMessages[targetIndex],
                            content: currentText,
                            isGenerating: true,
                        };
                    }
                    return newMessages;
                });

                await new Promise((resolve) => setTimeout(resolve, 30));
            }
        }

        setMessages((prev) => {
            const newMessages = [...prev];
            const targetIndex = messageIndex === -1 ? prev.length - 1 : messageIndex;
            if (newMessages[targetIndex]) {
                newMessages[targetIndex].isGenerating = false;
            }
            return newMessages;
        });
    };

    const handleSend = async () => {
        // CRITICAL: Check and set flag in one atomic operation to prevent React Strict Mode double-call
        if (isHandlingSend.current) return;
        isHandlingSend.current = true;

        // Now check other conditions
        if (isLoading || !input.trim()) {
            isHandlingSend.current = false;
            return;
        }

        const userMessage: Message = { role: 'user', content: input };
        const userMessageContent = input; // Store before clearing
        const assistantMessage: Message = {
            role: 'assistant',
            isGenerating: true,
        };

        // Clear input immediately
        setInput('');
        setIsLoading(true);

        // Add both messages in a single update to prevent race conditions
        setMessages((prev) => {
            const newMessages = [...prev, userMessage, assistantMessage];
            return newMessages;
        });

        // Create conversation if this is the first message and user is logged in
        let conversationId = currentConversation?.id;
        if (!conversationId && userId && messages.length === 1) {
            try {
                const title = generateConversationTitle(userMessageContent);
                const newConversation = await createConversation(userId, title);
                if (newConversation) {
                    conversationId = newConversation.id;
                    setCurrentConversation(newConversation);
                    // CRITICAL: Mark as loaded BEFORE updating URL to prevent loadConversation from wiping messages
                    hasLoadedConversation.current = true;
                    // Update URL with conversation ID
                    router.push(`/chat?conversation=${conversationId}`, { scroll: false });
                }
            } catch (error) {
                console.error('Error creating conversation:', error);
            }
        }

        // Save user message to database
        if (conversationId && userId) {
            try {
                await saveMessage(conversationId, 'user', userMessageContent);
            } catch (error) {
                console.error('Error saving user message:', error);
            }
        }

        try {
            const response: SearchResponse = await searchTrials({
                query: userMessageContent,
                n_results: 10,
                similarity_threshold: enableMCP ? 0.3 : 0.2,
            });

            const sources: Array<{ type: string; id: string; relevance: string }> = [];

            if (response.sources?.vector_db) {
                response.sources.vector_db.forEach((src: any) => {
                    sources.push({
                        type: src.type || 'Trial',
                        id: src.trial_id || 'Unknown',
                        relevance: src.relevance || 'N/A',
                    });
                });
            }

            setMessages((prev) => {
                const newMessages = [...prev];
                const actualIndex = prev.length - 1; // Last message is the assistant
                newMessages[actualIndex] = {
                    role: 'assistant',
                    sources: sources,
                    confidence: response.confidence,
                    total_results: response.total_results,
                    processing_time: response.processing_time,
                    isGenerating: true,
                };
                return newMessages;
            });

            // Update map trials using semantic location extraction
            console.log('Search response:', response);
            console.log('Response answer:', response.answer);
            console.log('Trial locations:', response.trial_locations);

            // Try semantic location extraction from the response text
            try {
                if (response.answer) {
                    const locations = await extractAndGeocodeLocations(response.answer);
                    console.log('🗺️ Extracted locations:', locations);

                    if (locations && locations.length > 0) {
                        // Convert locations to trial format for mapping
                        const extractedTrials = locations.map((loc, idx) => ({
                            nct_id: `LOCATION-${idx + 1}`,
                            title: loc.place_name || loc.name,
                            official_title: `Clinical Trial - ${loc.place_name || loc.name}`,
                            status: 'RECRUITING',
                            phase: 'N/A',
                            condition: [],
                            eligibility_criteria: '',
                            min_age: '',
                            max_age: '',
                            gender: 'ALL',
                            brief_summary: `Location mentioned in search results: ${loc.context || loc.name}`,
                            interventions: [],
                            locations: [{
                                facility: loc.place_name || loc.name,
                                city: loc.name.split(',')[0] || '',
                                state: loc.context?.split(',')[0] || '',
                                country: 'USA'
                            }],
                            // Store coordinates for direct mapping
                            _geocoded: {
                                lng: loc.coordinates[0],
                                lat: loc.coordinates[1],
                                confidence: loc.confidence
                            }
                        }));

                        setCurrentTrials(extractedTrials);
                    } else {
                        console.log('⚠️ No locations found in response');
                        setCurrentTrials([]);
                    }
                }
            } catch (extractionError) {
                console.error('Location extraction error:', extractionError);
                setCurrentTrials([]);
            }

            await streamText(response.answer, -1);

            // Save assistant message to database after streaming is complete
            if (conversationId && userId) {
                try {
                    const assistantMessageContent = response.answer;
                    const metadata = {
                        sources: sources,
                        confidence: response.confidence,
                        total_results: response.total_results,
                        processing_time: response.processing_time,
                    };
                    await saveMessage(conversationId, 'assistant', assistantMessageContent, metadata);
                } catch (error) {
                    console.error('Error saving assistant message:', error);
                }
            }

        } catch (error) {
            console.error('Search error:', error);
            setMessages((prev) => {
                const newMessages = [...prev];
                const actualIndex = prev.length - 1; // Last message is the assistant
                newMessages[actualIndex] = {
                    role: 'assistant',
                    content: `Error: ${error instanceof Error ? error.message : 'Failed to search trials'}. Please try again.`,
                    confidence: 'error',
                    isGenerating: false,
                };
                return newMessages;
            });
        } finally {
            setIsLoading(false);
            isHandlingSend.current = false;
        }
    };

    const getConfidenceColor = (confidence?: string) => {
        switch (confidence) {
            case 'high': return 'text-green-500';
            case 'medium': return 'text-yellow-500';
            case 'low': return 'text-orange-500';
            case 'error': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getConfidenceEmoji = (confidence?: string) => {
        switch (confidence) {
            case 'high': return '🟢';
            case 'medium': return '🟡';
            case 'low': return '🔴';
            case 'error': return '⚠️';
            default: return '⚪';
        }
    };

    const copyToClipboard = async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const speakText = (text: string, index: number) => {
        // Stop any ongoing speech
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        // If clicking the same message that's already speaking, just stop
        if (speakingIndex === index) {
            setSpeakingIndex(null);
            return;
        }

        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        utterance.pitch = 0.95;
        utterance.volume = 1.0;

        // Update state when speech starts
        utterance.onstart = () => {
            setSpeakingIndex(index);
        };

        // Clear state when speech ends
        utterance.onend = () => {
            setSpeakingIndex(null);
        };

        // Clear state on error
        utterance.onerror = () => {
            setSpeakingIndex(null);
        };

        // Start speaking
        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setSpeakingIndex(null);
    };

    // Cleanup speech on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const formatContent = (content: string) => {
        // Simple markdown-like formatting
        return content
            .split('\n')
            .map((line, i) => {
                // Headers
                if (line.startsWith('###')) {
                    return <h3 key={i} className="text-lg font-bold mt-4 mb-2">{line.replace('###', '').trim()}</h3>;
                }
                if (line.startsWith('##')) {
                    return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.replace('##', '').trim()}</h2>;
                }
                // Bold text
                if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                        <p key={i} className="mb-2">
                            {parts.map((part, j) => (
                                j % 2 === 0 ? part : <strong key={j} className="font-semibold">{part}</strong>
                            ))}
                        </p>
                    );
                }
                // Lists
                if (line.startsWith('*') || line.startsWith('-')) {
                    return <li key={i} className="ml-4 mb-1">{line.substring(1).trim()}</li>;
                }
                // Regular text
                if (line.trim()) {
                    return <p key={i} className="mb-2">{line}</p>;
                }
                return <br key={i} />;
            });
    };

    return (
        <main className="pt-16 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold mb-2">Clinical Trial Assistant</h1>
                    <p className="text-muted-foreground">
                        Ask questions about clinical trials and get AI-powered answers
                    </p>
                </motion.div>

                {/* Chat and Map Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                    {/* Chat Container */}
                    <div className="lg:col-span-7 xl:col-span-8 bg-card/50 backdrop-blur-xl rounded-3xl border border-border shadow-lg overflow-hidden flex flex-col" style={{ height: '600px' }}>
                        {/* Messages Area with Internal Scroll */}
                        <div
                            ref={scrollContainerRef}
                            className="flex-1 overflow-y-auto p-6"
                            data-lenis-prevent
                            style={{
                                scrollBehavior: 'smooth',
                                WebkitOverflowScrolling: 'touch'
                            }}
                        >
                            <div className="space-y-4">
                                {messages.map((message, index) => {
                                    // Skip invalid messages
                                    if (!message || !message.role) {
                                        console.warn('⚠️ Skipping invalid message at index', index, message);
                                        return null;
                                    }

                                    // Determine if this is a search result message (not welcome message)
                                    const isSearchResult = message.sources !== undefined || message.confidence !== undefined;

                                    return (
                                        <div key={index}>
                                            <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                {/* Avatar */}
                                                <div
                                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-secondary text-secondary-foreground'
                                                        }`}
                                                >
                                                    {message.role === 'user' ? (
                                                        <User className="w-4 h-4" />
                                                    ) : (
                                                        <Bot className="w-4 h-4" />
                                                    )}
                                                </div>

                                                {/* Message Content */}
                                                <div
                                                    className={`${message.content && message.role === 'assistant' ? 'flex-1 max-w-[75%]' : 'max-w-[75%]'} rounded-2xl px-5 py-3 ${message.role === 'user'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-secondary text-secondary-foreground'
                                                        }`}
                                                >
                                                    {/* Show content or typing dots */}
                                                    {message.isGenerating && !message.content ? (
                                                        <TypingDots />
                                                    ) : message.content ? (
                                                        <>
                                                            {message.role === 'user' ? (
                                                                <p className="leading-relaxed whitespace-pre-wrap text-sm">
                                                                    {message.content}
                                                                </p>
                                                            ) : (
                                                                <>
                                                                    <div className="space-y-2">
                                                                        {/* Formatted Content */}
                                                                        <div className="prose prose-sm max-w-none prose-invert">
                                                                            {formatContent(message.content)}
                                                                        </div>
                                                                        {message.isGenerating && (
                                                                            <span className="inline-block w-1.5 h-4 ml-1 bg-current animate-pulse" />
                                                                        )}
                                                                    </div>
                                                                    {/* Metadata and Confidence inline */}
                                                                    {!message.isGenerating && isSearchResult && (
                                                                        <div className="flex items-center gap-3 text-xs mt-4">
                                                                            {message.total_results !== undefined && (
                                                                                <span className="text-[10px] opacity-50">{message.total_results} trials found</span>
                                                                            )}
                                                                            {message.processing_time !== undefined && (
                                                                                <span className="text-[10px] opacity-50">⚡{message.processing_time.toFixed(2)}s</span>
                                                                            )}
                                                                            {message.confidence && (
                                                                                <span className="text-[10px] opacity-50 capitalize">
                                                                                    Confidence: {message.confidence}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </>
                                                    ) : (
                                                        /* Fallback for messages without content and not generating */
                                                        <p className="text-muted-foreground text-sm italic">No content</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons and Source Avatars (below message bubble, aligned with avatar) */}
                                            {message.role === 'assistant' && !message.isGenerating && isSearchResult && message.content && (
                                                <div className="flex gap-3 mt-2">
                                                    {/* Spacer to align with avatar */}
                                                    <div className="w-8 flex-shrink-0" />

                                                    {/* Action buttons and source avatars */}
                                                    <div className="flex items-center gap-2">
                                                        {/* Copy Button */}
                                                        <button
                                                            onClick={() => copyToClipboard(message.content || '', index)}
                                                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                                                            title="Copy response"
                                                        >
                                                            {copiedIndex === index ? (
                                                                <Check className="w-4 h-4 text-green-500" />
                                                            ) : (
                                                                <Copy className="w-4 h-4 text-muted-foreground" />
                                                            )}
                                                        </button>

                                                        {/* Speaker Button */}
                                                        <button
                                                            onClick={() => speakText(message.content || '', index)}
                                                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                                                            title={speakingIndex === index ? "Stop speaking" : "Read aloud"}
                                                        >
                                                            {speakingIndex === index ? (
                                                                <VolumeX className="w-4 h-4 text-primary animate-pulse" />
                                                            ) : (
                                                                <Volume2 className="w-4 h-4 text-muted-foreground" />
                                                            )}
                                                        </button>

                                                        {/* Source Avatars */}
                                                        {message.sources && message.sources.length > 0 && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedSources(message.sources || []);
                                                                    setSourcesModalOpen(true);
                                                                }}
                                                                className="relative group"
                                                                title={`View ${message.sources.length} sources`}
                                                            >
                                                                <Image
                                                                    src="/ctg.png"
                                                                    alt="ClinicalTrials.gov"
                                                                    width={32}
                                                                    height={32}
                                                                    className="rounded-full border-2 border-border hover:border-primary transition-colors cursor-pointer"
                                                                />
                                                                {message.sources.length > 1 && (
                                                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                                                                        {message.sources.length}
                                                                    </span>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Input Section */}
                        <div className="border-t border-border p-6 space-y-3 bg-card/30">
                            {/* MCP Toggle Switch */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setEnableMCP(!enableMCP)}
                                        className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${enableMCP ? 'bg-primary' : 'bg-muted'
                                            }`}
                                    >
                                        <motion.div
                                            className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center ${enableMCP ? 'text-primary' : 'text-muted-foreground'
                                                }`}
                                            animate={{
                                                x: enableMCP ? 32 : 0,
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 500,
                                                damping: 30
                                            }}
                                        >
                                            {enableMCP ? (
                                                <Network className="w-3.5 h-3.5" />
                                            ) : (
                                                <DatabaseZap className="w-3.5 h-3.5" />
                                            )}
                                        </motion.div>
                                    </button>
                                    <span className="text-xs font-medium">
                                        {enableMCP ? 'External Data' : 'Local Database'}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {enableMCP ? 'ClinicalTrials.gov + PubMed' : 'Local vector DB only'}
                                </span>
                            </div>

                            {/* Input Row */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!isLoading && input.trim()) {
                                        handleSend();
                                    }
                                }}
                                className="flex items-center gap-3"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about clinical trials..."
                                    disabled={isLoading}
                                    className="flex-1 bg-muted rounded-full px-5 py-2.5 outline-none text-foreground placeholder:text-muted-foreground disabled:opacity-50 text-sm"
                                />
                                <Button
                                    type="button"
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="rounded-full"
                                    size="icon"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Map Sidebar */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-5 xl:col-span-4 h-[400px] lg:h-[600px]"
                    >
                        <GlassCard className="h-full overflow-hidden p-0 border-border/50 flex flex-col">
                            <div className="p-4 border-b border-border/50 bg-card/30 flex items-center justify-between flex-shrink-0">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <MapIcon className="w-4 h-4 text-primary" />
                                    Trial Locations
                                </h3>
                                {currentTrials.length > 0 && (
                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                        {currentTrials.length} Markers
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 w-full relative">
                                <TrialMap trials={currentTrials} />
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Suggested Questions */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Explore Questions • Click to view options
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {questionCategories.map((category, index) => (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                            >
                                <ExpandableCard
                                    title={category.title}
                                    description={category.description}
                                    classNameExpanded="[&_button]:text-primary [&_button]:hover:bg-primary/10"
                                >
                                    <div className="space-y-2">
                                        {category.questions.map((question, qIndex) => (
                                            <button
                                                key={qIndex}
                                                onClick={() => {
                                                    setInput(question);
                                                    // Close modal by simulating ESC key press
                                                    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                                                }}
                                                disabled={isLoading}
                                                className="w-full text-left text-sm text-foreground hover:text-primary transition-colors py-2.5 px-3 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/20 disabled:opacity-50"
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                </ExpandableCard>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Features */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
                >
                    <GlassCard className="text-center">
                        <h4 className="text-3xl font-bold text-foreground mb-2">995+</h4>
                        <p className="text-sm text-muted-foreground">
                            Clinical Trials
                        </p>
                    </GlassCard>

                    <GlassCard className="text-center">
                        <h4 className="text-3xl font-bold text-foreground mb-2">10k+</h4>
                        <p className="text-sm text-muted-foreground">
                            Embeddings Generated
                        </p>
                    </GlassCard>

                    <GlassCard className="text-center">
                        <h4 className="text-3xl font-bold text-foreground mb-2">95%</h4>
                        <p className="text-sm text-muted-foreground">
                            Reduced Latency
                        </p>
                    </GlassCard>

                    <GlassCard className="text-center">
                        <h4 className="text-3xl font-bold text-foreground mb-2">24/7</h4>
                        <p className="text-sm text-muted-foreground">
                            Real-time Updates
                        </p>
                    </GlassCard>
                </motion.div>
            </div>

            {/* Sources Modal */}
            <SourcesModal
                sources={selectedSources}
                isOpen={sourcesModalOpen}
                onClose={() => setSourcesModalOpen(false)}
            />
        </main>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-8rem)]">
                    <GlassCard className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading chat...</p>
                        </div>
                    </GlassCard>
                </div>
            </main>
        }>
            <ChatPageContent />
        </Suspense>
    );
}
