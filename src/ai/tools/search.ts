'use server';

/**
 * @fileOverview Defines a Genkit tool for performing Google Custom Search.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const googleSearch = ai.defineTool(
  {
    name: 'googleSearch',
    description: 'Search Google for information. Useful for finding up-to-date information on careers, skills, and technologies.',
    inputSchema: z.object({
      query: z.string().describe('The search query.'),
    }),
    outputSchema: z.string().describe('A string of search results.'),
  },
  async input => {
    const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
      return 'Error: Google Custom Search API key or Search Engine ID is not configured.';
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(
      input.query
    )}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        return JSON.stringify(data.items.map((item: any) => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet
        })).slice(0, 5)); // Return top 5 results
      } else {
        return "No results found.";
      }

    } catch (err) {
      console.error(err);
      return 'Error performing search.';
    }
  }
);
