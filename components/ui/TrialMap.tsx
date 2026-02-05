'use client';

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Trial } from '@/lib/types';

interface TrialMapProps {
    trials: Trial[];
    onMarkerClick?: (trial: Trial) => void;
}

const TrialMap: React.FC<TrialMapProps> = ({ trials, onMarkerClick }) => {
    console.log('TrialMap rendered with trials:', trials);
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/satellite-streets-v12');

    const mapStyles = [
        { value: 'mapbox://styles/mapbox/satellite-streets-v12', label: 'Satellite' },
        { value: 'mapbox://styles/mapbox/streets-v12', label: 'Streets' },
        { value: 'mapbox://styles/mapbox/outdoors-v12', label: 'Outdoors' },
        { value: 'mapbox://styles/mapbox/dark-v11', label: 'Dark' },
    ];

    useEffect(() => {
        if (!mapContainer.current) return;

        // Initialize map
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

        if (!mapboxgl.accessToken) {
            console.error('Mapbox token not found. Please set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local');
            return;
        }

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: mapStyle,
            center: [-98.5795, 39.8283], // Center of USA
            zoom: 3,
        });

        map.current.on('load', () => {
            setMapLoaded(true);
        });

        return () => {
            map.current?.remove();
        };
    }, []);

    useEffect(() => {
        if (!map.current || !mapLoaded) return;

        // Clear existing markers
        const markers = document.querySelectorAll('.mapboxgl-marker');
        markers.forEach(marker => marker.remove());

        // Add markers for each trial location (async)
        const addMarkers = async () => {
            const bounds = new mapboxgl.LngLatBounds();
            let hasMarkers = false;

            for (const trial of trials) {
                console.log('Processing trial for map:', trial.nct_id, trial.locations);
                
                // Check if trial has pre-geocoded coordinates (from semantic extraction)
                if (trial._geocoded) {
                    const { lng, lat, confidence } = trial._geocoded;
                    const coordinates: [number, number] = [lng, lat];
                    
                    hasMarkers = true;
                    bounds.extend(coordinates);

                    // Create custom marker element with confidence indicator
                    const el = document.createElement('div');
                    el.className = 'trial-marker';
                    el.style.width = '24px';
                    el.style.height = '24px';
                    el.style.borderRadius = '50%';
                    el.style.backgroundColor = confidence > 0.8 ? '#10b981' : '#f59e0b';
                    el.style.border = '2px solid white';
                    el.style.cursor = 'pointer';
                    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                    el.style.opacity = String(Math.max(0.7, confidence));

                    // Create popup
                    const location = trial.locations[0] || {};
                    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                        <div style="padding: 8px; max-width: 250px;">
                            <div style="font-weight: bold; margin-bottom: 4px; font-size: 12px;">${trial.nct_id}</div>
                            <div style="margin-bottom: 8px; font-size: 11px; line-height: 1.4;">${trial.title}</div>
                            <div style="font-size: 10px; color: #888;">
                                ${location.facility || ''}<br/>
                                ${location.city || ''}, ${location.state || location.country || ''}
                            </div>
                        </div>
                    `);

                    // Add marker
                    const marker = new mapboxgl.Marker(el)
                        .setLngLat(coordinates)
                        .setPopup(popup)
                        .addTo(map.current!);

                    el.addEventListener('click', () => {
                        if (onMarkerClick) {
                            onMarkerClick(trial);
                        }
                    });
                    
                    continue; // Skip to next trial
                }
                
                // Otherwise, geocode each location (legacy path)
                for (const location of trial.locations) {
                    // Geocode the facility address
                    const coordinates = await geocodeAddress(
                        location.facility,
                        location.city,
                        location.state,
                        location.country
                    );

                    console.log(`Geocoded ${location.city}:`, coordinates);

                    if (coordinates) {
                        hasMarkers = true;
                        bounds.extend(coordinates);

                        // Create custom marker element
                        const el = document.createElement('div');
                        el.className = 'trial-marker';
                        el.style.width = '24px';
                        el.style.height = '24px';
                        el.style.borderRadius = '50%';
                        el.style.backgroundColor = trial.status === 'RECRUITING' ? '#10b981' : '#6b7280';
                        el.style.border = '2px solid white';
                        el.style.cursor = 'pointer';
                        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

                        // Create popup
                        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                            <div style="padding: 8px; max-width: 250px;">
                                <div style="font-weight: bold; margin-bottom: 4px; font-size: 12px;">${trial.nct_id}</div>
                                <div style="margin-bottom: 8px; font-size: 11px; line-height: 1.4;">${trial.title}</div>
                                <div style="font-size: 10px; color: #888;">
                                    ${location.facility}<br/>
                                    ${location.city}, ${location.state || location.country}
                                </div>
                            </div>
                        `);

                        // Add marker
                        const marker = new mapboxgl.Marker(el)
                            .setLngLat(coordinates)
                            .setPopup(popup)
                            .addTo(map.current!);

                        el.addEventListener('click', () => {
                            if (onMarkerClick) {
                                onMarkerClick(trial);
                            }
                        });
                    }
                }
            }

            // Fit map to markers if there are any
            if (hasMarkers && !bounds.isEmpty()) {
                map.current!.fitBounds(bounds, { padding: 50, maxZoom: 10 });
            }
        };

        addMarkers();
    }, [trials, mapLoaded, onMarkerClick]);

    // Handle map style changes
    useEffect(() => {
        if (map.current && mapLoaded) {
            map.current.setStyle(mapStyle);
        }
    }, [mapStyle, mapLoaded]);

    return (
        <div className="relative w-full h-full" style={{ minHeight: '600px' }}>
            {/* Map Style Selector */}
            <div className="absolute top-4 right-4 z-10">
                <select
                    value={mapStyle}
                    onChange={(e) => setMapStyle(e.target.value)}
                    className="glass px-4 py-2 rounded-lg text-sm font-medium text-foreground border border-border/50 cursor-pointer hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                    {mapStyles.map((style) => (
                        <option key={style.value} value={style.value}>
                            {style.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Map Container */}
            <div
                ref={mapContainer}
                className="w-full h-full rounded-lg overflow-hidden"
                style={{ minHeight: '600px' }}
            />
        </div>
    );
};

// Geocoding cache to avoid redundant API calls
const geocodeCache = new Map<string, [number, number] | null>();

// Geocode an address using Mapbox Geocoding API
async function geocodeAddress(facility: string, city: string, state: string, country: string): Promise<[number, number] | null> {
    const address = `${facility}, ${city}, ${state || ''} ${country}`.trim();
    const cacheKey = address.toLowerCase();

    // Check cache first
    if (geocodeCache.has(cacheKey)) {
        return geocodeCache.get(cacheKey)!;
    }

    try {
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!token) {
            console.error('Mapbox token not found');
            return null;
        }

        // Encode the address for URL
        const encodedAddress = encodeURIComponent(address);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${token}&limit=1`;

        console.log('🗺️ Geocoding:', address);

        const response = await fetch(url);
        if (!response.ok) {
            console.error('Geocoding API error:', response.statusText);
            geocodeCache.set(cacheKey, null);
            return null;
        }

        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            const coordinates: [number, number] = [lng, lat];
            const placeName = data.features[0].place_name;
            console.log('   ✓ Found:', placeName, '→ [', lng.toFixed(4), ',', lat.toFixed(4), ']');
            geocodeCache.set(cacheKey, coordinates);
            return coordinates;
        } else {
            console.warn('   ✗ No results for:', address);
            // No results found, cache null to avoid repeated attempts
            geocodeCache.set(cacheKey, null);
            return null;
        }
    } catch (error) {
        console.error('Error geocoding address:', address, error);
        geocodeCache.set(cacheKey, null);
        return null;
    }
}

export default TrialMap;
