const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export interface ExtractedLocation {
  name: string;
  type: 'city' | 'country' | 'landmark' | 'region' | 'address';
  confidence: number;
}

export interface GeocodedLocation extends ExtractedLocation {
  coordinates: [number, number]; // [lng, lat]
  place_name?: string;
  context?: string; // e.g., "Boston, Massachusetts, United States"
}

export interface LocationExtractionResult {
  locations: ExtractedLocation[];
}

/**
 * Extract locations from text using LLM with structured output
 */
export async function extractLocationsWithLLM(text: string): Promise<ExtractedLocation[]> {
  try {
    // Check if API key is configured
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';

    if (!apiKey) {
      console.warn('⚠️ Google API key not configured, using fallback extraction');
      return fallbackLocationExtraction(text);
    }

    const prompt = `Extract all geographic locations mentioned in the text.
Return ONLY valid JSON in the following format:

{
  "locations": [
    {
      "name": "string",
      "type": "city | country | landmark | region | address",
      "confidence": 0.0-1.0
    }
  ]
}

Rules:
- Extract city names, state names, facility names with locations
- Include landmarks if they help identify a place
- Confidence should be 0.9+ for explicit mentions, 0.5-0.8 for inferred locations
- Return empty array if no locations found
- Do NOT include generic phrases like "near you" or "in your area"

Text:
"""
${text}
"""

JSON output:`;

    // Use Gemini API for structured extraction
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a precise location extraction system. Output only valid JSON.\\n\\n${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 500,
          responseMimeType: 'application/json'
        }
      }),
    });

    if (!response.ok) {
      console.warn('LLM extraction failed, using fallback:', response.status);
      return fallbackLocationExtraction(text);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.warn('No content from LLM, using fallback');
      return fallbackLocationExtraction(text);
    }

    const parsed: LocationExtractionResult = JSON.parse(content);

    // Validate and filter results
    const locations = parsed.locations
      .filter(loc => loc.confidence >= 0.5)
      .filter(loc => loc.name && loc.name.length > 2)
      .slice(0, 20); // Limit to 20 locations max

    console.log(`✅ Extracted ${locations.length} locations using LLM`);
    return locations;

  } catch (error) {
    console.warn('Location extraction error, using fallback:', error);
    return fallbackLocationExtraction(text);
  }
}

/**
 * Fallback: Simple pattern matching for common location formats
 */
function fallbackLocationExtraction(text: string): ExtractedLocation[] {
  const locations: ExtractedLocation[] = [];

  // Pattern: City, State format
  const cityStatePattern = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)?),\s*([A-Z]{2}|[A-Z][a-z]+)/g;
  let match: RegExpExecArray | null;

  while ((match = cityStatePattern.exec(text)) !== null) {
    locations.push({
      name: `${match[1]}, ${match[2]}`,
      type: 'city',
      confidence: 0.7
    });
  }

  // Pattern: State names alone
  const statePattern = /\b(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)\b/g;

  let stateMatch: RegExpExecArray | null;
  while ((stateMatch = statePattern.exec(text)) !== null) {
    const stateName = stateMatch[1];
    if (!locations.some(loc => loc.name.includes(stateName))) {
      locations.push({
        name: stateName,
        type: 'region',
        confidence: 0.6
      });
    }
  }

  console.log(`⚠️ Using fallback extraction: ${locations.length} locations`);
  return locations.slice(0, 10);
}

/**
 * Geocode a location name to coordinates using Mapbox
 */
export async function geocodeLocation(locationName: string): Promise<GeocodedLocation | null> {
  try {
    const encodedLocation = encodeURIComponent(locationName);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedLocation}.json?access_token=${MAPBOX_TOKEN}&limit=1&types=place,region,locality,neighborhood,address`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Geocoding failed for "${locationName}":`, response.status);
      return null;
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      console.warn(`No geocoding results for "${locationName}"`);
      return null;
    }

    const feature = data.features[0];
    const [lng, lat] = feature.center;

    return {
      name: locationName,
      type: guessLocationType(feature.place_type),
      confidence: feature.relevance || 0.8,
      coordinates: [lng, lat],
      place_name: feature.place_name,
      context: feature.context?.map((c: any) => c.text).join(', ')
    };

  } catch (error) {
    console.error(`Geocoding error for "${locationName}":`, error);
    return null;
  }
}

/**
 * Batch geocode multiple locations with rate limiting
 */
export async function geocodeLocations(
  locations: ExtractedLocation[],
  delayMs: number = 100
): Promise<GeocodedLocation[]> {
  const results: GeocodedLocation[] = [];

  for (const location of locations) {
    const geocoded = await geocodeLocation(location.name);

    if (geocoded) {
      results.push(geocoded);
    }

    // Rate limiting
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  console.log(`🗺️  Geocoded ${results.length}/${locations.length} locations`);
  return results;
}

/**
 * Main function: Extract and geocode locations from text
 */
export async function extractAndGeocodeLocations(text: string): Promise<GeocodedLocation[]> {
  console.log('🔍 Starting location extraction...');

  // Step 1: Extract locations using LLM
  const extractedLocations = await extractLocationsWithLLM(text);

  if (extractedLocations.length === 0) {
    console.log('No locations found');
    return [];
  }

  console.log(`📍 Found ${extractedLocations.length} locations:`,
    extractedLocations.map(l => l.name).join(', ')
  );

  // Step 2: Geocode to coordinates
  const geocodedLocations = await geocodeLocations(extractedLocations, 50);

  return geocodedLocations;
}

/**
 * Helper: Guess location type from Mapbox place_type
 */
function guessLocationType(placeTypes: string[]): ExtractedLocation['type'] {
  if (placeTypes.includes('place')) return 'city';
  if (placeTypes.includes('region')) return 'region';
  if (placeTypes.includes('country')) return 'country';
  if (placeTypes.includes('address')) return 'address';
  if (placeTypes.includes('poi') || placeTypes.includes('landmark')) return 'landmark';
  return 'city';
}

/**
 * Parse trial locations from the API response (with backward compatibility)
 */
export function parseTrialLocationsFromResponse(response: any): Array<{
  nct_id: string;
  title: string;
  locations: Array<{ facility: string; city: string; state: string; country: string }>;
}> {
  const trials: Array<any> = [];

  // Method 1: Direct trial_locations field
  if (response.trial_locations && Array.isArray(response.trial_locations)) {
    response.trial_locations.forEach((loc: any) => {
      if (loc.locations && Array.isArray(loc.locations)) {
        trials.push({
          nct_id: loc.nct_id,
          title: loc.title || loc.official_title || 'Unknown Trial',
          locations: loc.locations.map((l: any) => ({
            facility: l.facility || '',
            city: l.city || '',
            state: l.state || '',
            country: l.country || 'USA'
          }))
        });
      } else if (loc.city || loc.state) {
        const existing = trials.find(t => t.nct_id === loc.nct_id);
        const newLocation = {
          facility: loc.facility || '',
          city: loc.city || '',
          state: loc.state || '',
          country: loc.country || 'USA'
        };

        if (existing) {
          existing.locations.push(newLocation);
        } else {
          trials.push({
            nct_id: loc.nct_id,
            title: loc.title || 'Unknown Trial',
            locations: [newLocation]
          });
        }
      }
    });
  }

  // Method 2: Parse from sources
  if (trials.length === 0 && response.sources) {
    if (response.sources.vector_db && Array.isArray(response.sources.vector_db)) {
      response.sources.vector_db.forEach((src: any) => {
        if (src.locations && Array.isArray(src.locations) && src.locations.length > 0) {
          trials.push({
            nct_id: src.trial_id || src.nct_id || 'Unknown',
            title: src.title || src.official_title || 'Unknown Trial',
            locations: src.locations.map((l: any) => ({
              facility: l.facility || '',
              city: l.city || '',
              state: l.state || '',
              country: l.country || 'USA'
            }))
          });
        }
      });
    }
  }

  return trials;
}
