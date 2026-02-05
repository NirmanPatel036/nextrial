import axios, { AxiosInstance } from 'axios';

/**
 * API Client for NexTrial Backend
 * Connects to FastAPI backend deployed on Render.com
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Type Definitions
 */

export interface TrialSearchQuery {
    query: string;
    n_results?: number;
    similarity_threshold?: number;
    filters?: {
        status?: string;
        phase?: string;
        condition_category?: string;
        gender?: string;
        min_age?: number;
        max_age?: number;
    };
}

export interface TrialSearchResponse {
    answer: string;
    sources: {
        vector_db: Array<{
            trial_id: string;
            type: string;
            relevance: string;
        }>;
        mcp: Array<{
            tool: string;
            results: number;
        }>;
    };
    confidence: 'high' | 'medium' | 'low' | 'error';
    filters_applied: any;
    total_results: number;
    trial_locations?: Array<{
        nct_id: string;
        title: string;
        phase: string;
        status: string;
        conditions: string[];
        locations: Array<{
            city: string;
            state: string;
            country: string;
            facility: string;
        }>;
    }>;
}

export interface PatientMatchQuery {
    patient_id: string;
    n_results?: number;
    location_radius_miles?: number;
}

export interface ChatMessage {
    message: string;
    conversation_id?: string;
    context?: {
        patient_id?: string;
    };
}

export interface ChatResponse {
    answer: string;
    sources: any;
    conversation_id: string;
}

export interface PatientProfile {
    id?: string;
    user_id: string;
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

/**
 * API Functions
 */

// Trial Search
export const searchTrials = async (query: TrialSearchQuery): Promise<TrialSearchResponse> => {
    const response = await apiClient.post('/api/search/query', query);
    return response.data;
};

// Match patient to trials
export const matchPatient = async (query: PatientMatchQuery) => {
    const response = await apiClient.post('/api/search/match-patient', query);
    return response.data;
};

// Get trial details
export const getTrialDetails = async (nctId: string) => {
    const response = await apiClient.get(`/api/trials/${nctId}`);
    return response.data;
};

// Get trial locations
export const getTrialLocations = async (nctId: string) => {
    const response = await apiClient.get(`/api/trials/${nctId}/locations`);
    return response.data;
};

// Get related trials
export const getRelatedTrials = async (nctId: string) => {
    const response = await apiClient.get(`/api/trials/${nctId}/related`);
    return response.data;
};

// Check eligibility
export const checkEligibility = async (patientId: string, nctId: string) => {
    const response = await apiClient.post('/api/eligibility/check', {
        patient_id: patientId,
        nct_id: nctId,
    });
    return response.data;
};

// Chat
export const sendChatMessage = async (message: ChatMessage): Promise<ChatResponse> => {
    const response = await apiClient.post('/api/chat/message', message);
    return response.data;
};

export const getChatConversations = async () => {
    const response = await apiClient.get('/api/chat/conversations');
    return response.data;
};

export const getChatHistory = async (conversationId: string) => {
    const response = await apiClient.get(`/api/chat/conversations/${conversationId}`);
    return response.data;
};

export const deleteChatConversation = async (conversationId: string) => {
    const response = await apiClient.delete(`/api/chat/conversations/${conversationId}`);
    return response.data;
};

// Patient Management
export const createPatient = async (patient: PatientProfile) => {
    const response = await apiClient.post('/api/patients', patient);
    return response.data;
};

export const getPatient = async (patientId: string) => {
    const response = await apiClient.get(`/api/patients/${patientId}`);
    return response.data;
};

export const updatePatient = async (patientId: string, patient: Partial<PatientProfile>) => {
    const response = await apiClient.put(`/api/patients/${patientId}`, patient);
    return response.data;
};

export const deletePatient = async (patientId: string) => {
    const response = await apiClient.delete(`/api/patients/${patientId}`);
    return response.data;
};

export const listPatients = async () => {
    const response = await apiClient.get('/api/patients');
    return response.data;
};

export const exportPatientFHIR = async (patientId: string) => {
    const response = await apiClient.post(`/api/patients/${patientId}/fhir`);
    return response.data;
};

// Medical Terminology
export const mapToSNOMED = async (conditionText: string) => {
    const response = await apiClient.post('/api/medical/snomed', { condition_text: conditionText });
    return response.data;
};

export const mapToICD10 = async (diagnosis: string) => {
    const response = await apiClient.post('/api/medical/icd10', { diagnosis });
    return response.data;
};

export const standardizeDrugName = async (drug: string) => {
    const response = await apiClient.post('/api/medical/drug-name', { drug });
    return response.data;
};

/**
 * Local Trial Data Utilities
 * For loading and searching trials from local JSON file
 */

import { Trial, TrialFilters, TrialSearchParams, TrialSearchResult } from './types';

let trialsCache: Trial[] | null = null;

// Load trials data from public directory
export const loadTrialsData = async (): Promise<Trial[]> => {
    if (trialsCache) {
        return trialsCache;
    }

    try {
        const response = await fetch('/data/trials_all.json');
        if (!response.ok) {
            throw new Error('Failed to load trials data');
        }
        const data: Trial[] = await response.json();
        trialsCache = data;
        return data;
    } catch (error) {
        console.error('Error loading trials data:', error);
        return [];
    }
};

// Get trial by NCT ID
export const getTrialByNCTId = async (nctId: string): Promise<Trial | null> => {
    const trials = await loadTrialsData();
    return trials.find(trial => trial.nct_id === nctId) || null;
};

// Search and filter trials locally
export const searchTrialsLocal = async (params: TrialSearchParams): Promise<TrialSearchResult> => {
    const { query = '', filters = {}, page = 1, pageSize = 20 } = params;
    let trials = await loadTrialsData();

    // Apply text search
    if (query.trim()) {
        const searchLower = query.toLowerCase();
        trials = trials.filter(trial => {
            // Search in NCT ID (exact match has priority)
            if (trial.nct_id.toLowerCase() === searchLower) {
                return true;
            }

            // Search in title
            if (trial.title.toLowerCase().includes(searchLower)) {
                return true;
            }

            // Search in conditions
            if (trial.condition.some(c => c.toLowerCase().includes(searchLower))) {
                return true;
            }

            // Search in summary
            if (trial.brief_summary.toLowerCase().includes(searchLower)) {
                return true;
            }

            // Search in interventions
            if (trial.interventions.some(i => i.toLowerCase().includes(searchLower))) {
                return true;
            }

            // Search in locations
            if (trial.locations.some(loc =>
                loc.city.toLowerCase().includes(searchLower) ||
                loc.state.toLowerCase().includes(searchLower) ||
                loc.country.toLowerCase().includes(searchLower) ||
                loc.facility.toLowerCase().includes(searchLower)
            )) {
                return true;
            }

            return false;
        });
    }

    // Apply filters
    if (filters.status && filters.status.length > 0) {
        trials = trials.filter(trial => filters.status!.includes(trial.status));
    }

    if (filters.phase && filters.phase.length > 0) {
        trials = trials.filter(trial => filters.phase!.includes(trial.phase));
    }

    if (filters.gender) {
        trials = trials.filter(trial =>
            trial.gender === 'ALL' || trial.gender === filters.gender
        );
    }

    if (filters.condition) {
        const conditionLower = filters.condition.toLowerCase();
        trials = trials.filter(trial =>
            trial.condition.some(c => c.toLowerCase().includes(conditionLower))
        );
    }

    if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        trials = trials.filter(trial =>
            trial.locations.some(loc =>
                loc.city.toLowerCase().includes(locationLower) ||
                loc.state.toLowerCase().includes(locationLower) ||
                loc.country.toLowerCase().includes(locationLower)
            )
        );
    }

    // Age filtering (simplified - would need more complex logic for real implementation)
    if (filters.minAge !== undefined || filters.maxAge !== undefined) {
        trials = trials.filter(trial => {
            // This is a simplified check - real implementation would parse age strings
            return true; // Keep all for now
        });
    }

    // Calculate pagination
    const total = trials.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTrials = trials.slice(startIndex, endIndex);

    return {
        trials: paginatedTrials,
        total,
        page,
        pageSize,
        totalPages,
    };
};

// Get unique values for filters
export const getFilterOptions = async () => {
    const trials = await loadTrialsData();

    const statuses = new Set<string>();
    const phases = new Set<string>();
    const conditions = new Set<string>();
    const countries = new Set<string>();

    trials.forEach(trial => {
        statuses.add(trial.status);
        phases.add(trial.phase);
        trial.condition.forEach(c => conditions.add(c));
        trial.locations.forEach(loc => countries.add(loc.country));
    });

    return {
        statuses: Array.from(statuses).sort(),
        phases: Array.from(phases).sort(),
        conditions: Array.from(conditions).sort(),
        countries: Array.from(countries).sort(),
    };
};

// Get random recruiting trials for homepage
export const getRandomRecruitingTrials = async (count: number = 3): Promise<Trial[]> => {
    const trials = await loadTrialsData();
    const recruitingTrials = trials.filter(trial => trial.status === 'RECRUITING');

    // Shuffle and take first N
    const shuffled = recruitingTrials.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

export default apiClient;

