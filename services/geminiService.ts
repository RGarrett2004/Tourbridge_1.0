
import { GoogleGenAI, Type } from "@google/genai";
import { MarkerType, LocationPoint, EventListing, TourDay } from "../types";

export interface EnrichedVenueData {
  text: string;
  mapsLinks: { title: string; uri: string }[];
  reviewSnippets: { text: string; uri: string }[];
  rating?: string;
  phone?: string;
  website?: string;
}

export interface TourManagerIntel {
  foodAndBev: { name: string; desc: string; isVeganFriendly: boolean; relevance: string }[];
  hotels: { name: string; priceCategory: string; reason: string }[];
  localTips: string;
}

export class GeminiService {
  /**
   * Fetches weather forecast for a location/date.
   */
  async getWeatherInfo(city: string, date: string): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `What is the typical or predicted weather in ${city} for ${date}? Give a one-sentence summary with an emoji (e.g. "Sunny and 75°F ☀️").`,
      });
      return response.text?.trim() || "Weather unavailable";
    } catch (error) {
      console.error("Weather Error:", error);
      return "Weather service offline";
    }
  }

  /**
   * Smart Import: Extracts tour dates, venues, and cities from a URL.
   */
  async smartImportTour(url: string): Promise<{ name: string; days: Partial<TourDay>[] }> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Extract the tour itinerary from this URL: ${url}. 
        Identify the band/artist name, show dates, venue names, and cities (City, State).
        Format the output as a JSON object with 'name' (string) and 'days' (array of TourDay-like objects).
        Each day object should have: date (YYYY-MM-DD), cityName, state, venueName, status ('SHOW').`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    date: { type: Type.STRING },
                    cityName: { type: Type.STRING },
                    state: { type: Type.STRING },
                    venueName: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ["SHOW", "TRAVEL", "OFF"] }
                  },
                  required: ["date", "cityName", "venueName"]
                }
              }
            },
            required: ["name", "days"]
          }
        }
      });

      return JSON.parse(response.text?.trim() || "{}");
    } catch (error) {
      console.error("Smart Import Error:", error);
      throw new Error("Failed to extract tour data from the provided link.");
    }
  }

  /**
   * Parses tour data from raw text or CSV.
   */
  async smartImportFromText(text: string): Promise<{ name: string; days: Partial<TourDay>[] }> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Extract the tour itinerary from this text/CSV:
        
        ${text}

        Identify the band/artist name, show dates, venue names, and cities (City, State).
        Format the output as a JSON object with 'name' (string) and 'days' (array of TourDay-like objects).
        Each day object should have: date (YYYY-MM-DD), cityName, state, venueName, status ('SHOW').`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    date: { type: Type.STRING },
                    cityName: { type: Type.STRING },
                    state: { type: Type.STRING },
                    venueName: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ["SHOW", "TRAVEL", "OFF"] }
                  },
                  required: ["date", "cityName", "venueName"]
                }
              }
            },
            required: ["name", "days"]
          }
        }
      });

      return JSON.parse(response.text?.trim() || "{}");
    } catch (error) {
      console.error("Text Import Error:", error);
      throw new Error("Failed to parse tour data from text.");
    }
  }

  /**
   * Fetches gig listings for a specific location using search grounding.
   */
  async searchGigsByLocation(location: string): Promise<EventListing[]> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `I am looking for live music gig opportunities or venue booking openings in ${location}. 
        Return a list of 5 real or highly probable upcoming local show opportunities for independent bands.
        Include venue name, tentative date, a short description of the gig/vibe, and genre tags.
        Return valid JSON array of objects following the EventListing type.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                venueId: { type: Type.STRING },
                venueName: { type: Type.STRING },
                title: { type: Type.STRING },
                date: { type: Type.STRING },
                time: { type: Type.STRING },
                description: { type: Type.STRING },
                genreTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                status: { type: Type.STRING, enum: ["OPEN", "CLOSED", "FULL"] },
                applications: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["id", "venueName", "title", "date", "description", "genreTags", "status"]
            }
          }
        }
      });

      return JSON.parse(response.text?.trim() || "[]") as EventListing[];
    } catch (error) {
      console.error("Search Gigs Error:", error);
      return [];
    }
  }

  /**
   * Enriches venue data using Gemini 2.5 with Google Maps grounding.
   */
  async getVenueDetailsEnriched(name: string, address: string): Promise<EnrichedVenueData | null> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Provide live details for the music venue "${name}" located at "${address}". 
        I need the current Google Maps rating, a couple of recent short review snippets, their official website, and their phone number.`,
        config: {
          tools: [{ googleMaps: {} }],
        },
      });

      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      const mapsLinks: { title: string; uri: string }[] = [];
      const reviewSnippets: { text: string; uri: string }[] = [];

      chunks.forEach((chunk: any) => {
        if (chunk.maps?.uri) {
          mapsLinks.push({
            title: chunk.maps.title || "View on Google Maps",
            uri: chunk.maps.uri
          });

          if (chunk.maps.placeAnswerSources?.reviewSnippets) {
            chunk.maps.placeAnswerSources.reviewSnippets.forEach((snippet: any) => {
              reviewSnippets.push({
                text: snippet.text,
                uri: snippet.uri
              });
            });
          }
        }
      });

      const ratingMatch = text.match(/(\d\.\d)\s?star/i) || text.match(/rating of (\d\.\d)/i);
      const phoneMatch = text.match(/(\+?\d[\d\s\-\(\)]{8,}\d)/);
      const webMatch = text.match(/https?:\/\/[^\s]+/);

      return {
        text,
        mapsLinks,
        reviewSnippets,
        rating: ratingMatch ? ratingMatch[1] : undefined,
        phone: phoneMatch ? phoneMatch[1] : undefined,
        website: webMatch ? webMatch[0] : undefined
      };
    } catch (error) {
      console.error("Gemini Maps Error:", error);
      return null;
    }
  }

  /**
   * Provides personalized local intelligence for Tour Managers.
   */
  async getTourManagerIntel(city: string, venue?: string, diet?: string): Promise<TourManagerIntel> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `I am a tour manager for a band visiting ${city}${venue ? ` and playing a show at ${venue}` : ''}. 
      The band members have a ${diet || 'none'} dietary preference. 
      Recommend:
      1. 3 local food/bev spots. ${venue ? 'Priority: Places within walking distance of ' + venue + '.' : ''} 
      2. 2 cheap/reliable hotels for touring vans with oversized parking.
      3. 2 general survival tips for musicians in this area (parking safety, load-in quirks).
      
      For food spots, specify if they match the "${diet}" preference.
      Return valid JSON only.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              foodAndBev: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    desc: { type: Type.STRING },
                    isVeganFriendly: { type: Type.BOOLEAN },
                    relevance: { type: Type.STRING, description: "Why it's good for this band/venue" }
                  },
                  required: ["name", "desc", "isVeganFriendly", "relevance"]
                }
              },
              hotels: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    priceCategory: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ["name", "priceCategory", "reason"]
                }
              },
              localTips: { type: Type.STRING }
            },
            required: ["foodAndBev", "hotels", "localTips"]
          }
        }
      });

      return JSON.parse(response.text?.trim() || "{}") as TourManagerIntel;
    } catch (error) {
      console.error("Tour Manager Intel Error:", error);
      return { foodAndBev: [], hotels: [], localTips: "Could not fetch city intelligence." };
    }
  }

  /**
   * Discovers local music nodes using Gemini 3 Flash. 
   */
  async discoverLocalNodes(lat: number, lng: number, radiusKm: number = 8): Promise<LocationPoint[]> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Perform a spatial search for real-world music infrastructure within ${radiusKm}km of coordinates (${lat}, ${lng}).
        Return exactly 10-15 real, existing locations.
        Categorize strictly as:
        - 'VENUE': Music venues, dive bars with live bands, restaurants with jazz/local music, nightclubs.
        - 'PRO': Recording studios, rehearsal complexes, music production firms.
        - 'CREATOR': Photography studios or media centers used by bands.
        
        Return valid JSON array only.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER },
                address: { type: Type.STRING },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["VENUE", "PRO", "CREATOR"] },
                website: { type: Type.STRING }
              },
              required: ["name", "lat", "lng", "address", "type", "description"]
            }
          }
        }
      });

      const rawJson = JSON.parse(response.text?.trim() || "[]");
      return rawJson.map((item: any, idx: number) => ({
        ...item,
        id: `dynamic-${item.name.replace(/\s+/g, '-').toLowerCase()}-${idx}`,
        reviews: [],
        avgRating: 0,
        isDynamic: true,
        type: item.type as MarkerType
      }));
    } catch (error) {
      console.error("Discovery error:", error);
      return [];
    }
  }

  async discoverVenues(location: string, query: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: `I am a touring musician looking for ${query} in ${location}. 
        Provide a list of potential venues, their vibes, and why they are good for independent artists.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      return {
        text: response.text || "No results found.",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      };
    } catch (error) {
      console.error("Gemini Search Error:", error);
      return { text: "Failed to fetch real-time data.", sources: [] };
    }
  }

  async getTourTip(city: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Give me 3 practical tips for an independent band touring in ${city}. Focus on parking (vandalism risks), cheap food, and load-in advice.`
      });
      return response.text || "";
    } catch (error) {
      console.error("Gemini Tip Error:", error);
      return "Unable to fetch tips at this time.";
    }
  }

  async supportChat(userMessage: string, history: { role: string, parts: { text: string }[] }[]) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `You are the "TourBridge Guardian," a world-class AI assistant for a national database of music venues, artist hosts, and production crew.
      
      Always prioritize the safety and reliability of the touring musicians.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: [...history, { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
        }
      });

      return {
        text: response.text || "I'm having trouble connecting to the network mainframe.",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      };
    } catch (error) {
      console.error("Support chat error:", error);
      return { text: "The network is experiencing heavy traffic. Please try again soon.", sources: [] };
    }
  }
}

export const geminiService = new GeminiService();
