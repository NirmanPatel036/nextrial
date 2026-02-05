'use client';

/**
 * Example Search Component for Clinical Trial Matcher
 * 
 * This demonstrates how to integrate the backend API with your Next.js frontend
 * Copy this to your components directory and customize as needed
 */

import { useState, useEffect } from 'react';
import { searchTrials, checkHealth, type SearchResponse, type HealthResponse } from '@/lib/api-client';

export function ClinicalTrialSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);

  // Check API health on mount
  useEffect(() => {
    checkHealth()
      .then(setHealth)
      .catch((err) => console.error('Health check failed:', err));
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await searchTrials({
        query,
        n_results: 10,
        similarity_threshold: 0.3,
      });
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Health Status */}
      {health && (
        <div className={`p-3 rounded-lg text-sm ${
          health.status === 'healthy' 
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
        }`}>
          <span className="font-semibold">API Status:</span> {health.status}
          {health.stats?.vector_db?.total_count && (
            <span className="ml-2">
              • {health.stats.vector_db.total_count.toLocaleString()} trials indexed
            </span>
          )}
        </div>
      )}

      {/* Search Input */}
      <div className="space-y-3">
        <label htmlFor="search" className="block text-lg font-semibold text-gray-900">
          Search Clinical Trials
        </label>
        <div className="flex gap-3">
          <textarea
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="E.g., Find breast cancer trials for stage 2 patients with HER2+ biomarker in Boston..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            disabled={loading}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Searching...
            </span>
          ) : (
            'Search Trials'
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900">
                Found {results.total_results} Clinical Trials
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                results.confidence === 'high' 
                  ? 'bg-green-100 text-green-800'
                  : results.confidence === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {results.confidence} confidence
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {results.answer}
            </p>
            <p className="text-sm text-gray-500 mt-3">
              Processing time: {results.processing_time.toFixed(2)}s
            </p>
          </div>

          {/* Trial List */}
          {results.trial_locations && results.trial_locations.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Trial Locations
              </h4>
              <div className="space-y-3">
                {results.trial_locations.map((trial, index) => (
                  <div
                    key={trial.nct_id}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                            {index + 1}
                          </span>
                          <a
                            href={`https://clinicaltrials.gov/study/${trial.nct_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-mono text-sm font-semibold"
                          >
                            {trial.nct_id}
                          </a>
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-2">
                          {trial.title}
                        </h5>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            📍 {trial.city}, {trial.state}
                          </span>
                          {trial.distance_km !== undefined && (
                            <span className="flex items-center gap-1">
                              🚗 {trial.distance_km.toFixed(1)} km away
                            </span>
                          )}
                          {trial.similarity_score !== undefined && (
                            <span className="flex items-center gap-1">
                              🎯 {(trial.similarity_score * 100).toFixed(0)}% match
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !results && !error && (
        <div className="text-center py-12 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-lg font-medium">Search for clinical trials</p>
          <p className="text-sm mt-1">Enter a query to find matching trials based on your criteria</p>
        </div>
      )}
    </div>
  );
}

export default ClinicalTrialSearch;
