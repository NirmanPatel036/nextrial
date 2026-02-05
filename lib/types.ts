/**
 * Type definitions for Clinical Trial data
 */

export interface TrialLocation {
    facility: string;
    city: string;
    state: string;
    country: string;
}

export interface Trial {
    nct_id: string;
    title: string;
    official_title: string;
    status: string;
    phase: string;
    condition: string[];
    eligibility_criteria: string;
    min_age: string;
    max_age: string;
    gender: string;
    brief_summary: string;
    interventions: string[];
    locations: TrialLocation[];
    // Optional geocoded data for semantic extraction
    _geocoded?: {
        lng: number;
        lat: number;
        confidence: number;
    };
}

export interface TrialFilters {
    status?: string[];
    phase?: string[];
    gender?: string;
    minAge?: number;
    maxAge?: number;
    condition?: string;
    location?: string;
}

export interface TrialSearchParams {
    query?: string;
    filters?: TrialFilters;
    page?: number;
    pageSize?: number;
}

export interface SavedTrial {
    id: string;
    user_id: string;
    nct_id: string;
    title: string;
    status?: string;
    phase?: string;
    condition?: string[];
    brief_summary?: string;
    saved_at: string;
    notes?: string;
}

export interface TrialSearchResult {
    trials: Trial[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
