'use server';

/**
 * @fileOverview This file defines a Genkit flow for finding job and internship opportunities using web search.
 *
 * It includes:
 * - findOpportunities: The main function to trigger the opportunity finding flow.
 * - FindOpportunitiesInput: The input type for the findOpportunities function.
 * - FindOpportunitiesOutput: The output type for the findOpportunities function.
 */

import {ai} from '@/ai/genkit';
import {googleSearch} from '@/ai/tools/search';
import {z} from 'genkit';

const FindOpportunitiesInputSchema = z.object({
  query: z.string().describe('The search query for finding jobs or internships (e.g., "software developer jobs in Bengaluru").'),
});
export type FindOpportunitiesInput = z.infer<typeof FindOpportunitiesInputSchema>;

const OpportunitySchema = z.object({
    title: z.string().describe('The job or internship title.'),
    companyName: z.string().describe('The name of the company.'),
    location: z.string().describe('The location of the job.'),
    url: z.string().url().describe('A direct URL to the job posting or application page.'),
});

const FindOpportunitiesOutputSchema = z.object({
  opportunities: z.array(OpportunitySchema).describe('A list of found opportunities.'),
});
export type FindOpportunitiesOutput = z.infer<typeof FindOpportunitiesOutputSchema>;

export async function findOpportunities(input: FindOpportunitiesInput): Promise<FindOpportunitiesOutput> {
  return findOpportunitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findOpportunitiesPrompt',
  input: {schema: FindOpportunitiesInputSchema},
  output: {schema: FindOpportunitiesOutputSchema},
  tools: [googleSearch],
  prompt: `You are an expert career search assistant. Your task is to find job or internship opportunities based on a user's query.

Use the provided googleSearch tool to find relevant listings. Analyze the search results and extract the following details for each opportunity:
- Job Title
- Company Name
- Location
- A direct URL to the posting.

Return a list of the opportunities you find. Prioritize results that seem to be direct job postings on company websites or major job boards.

User's search query: {{{query}}}
`,
});

const findOpportunitiesFlow = ai.defineFlow(
  {
    name: 'findOpportunitiesFlow',
    inputSchema: FindOpportunitiesInputSchema,
    outputSchema: FindOpportunitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
