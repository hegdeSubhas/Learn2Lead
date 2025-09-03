'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a job roadmap based on user interests.
 *
 * It includes:
 * - generateJobRoadmap: The main function to trigger the job roadmap generation flow.
 * - GenerateJobRoadmapInput: The input type for the generateJobRoadmap function.
 * - GenerateJobRoadmapOutput: The output type for the generateJobRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJobRoadmapInputSchema = z.object({
  jobRole: z.string().describe('The specific job role for which to generate a roadmap.'),
  interests: z.string().describe('The interests of the student to tailor the roadmap.'),
});
export type GenerateJobRoadmapInput = z.infer<typeof GenerateJobRoadmapInputSchema>;

const GenerateJobRoadmapOutputSchema = z.object({
  roadmap: z.string().describe('The generated roadmap for the specified job role, tailored to the student\s interests.'),
  resources: z.string().describe('Suggested resources such as books, websites, or courses.'),
});
export type GenerateJobRoadmapOutput = z.infer<typeof GenerateJobRoadmapOutputSchema>;

export async function generateJobRoadmap(input: GenerateJobRoadmapInput): Promise<GenerateJobRoadmapOutput> {
  return generateJobRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJobRoadmapPrompt',
  input: {schema: GenerateJobRoadmapInputSchema},
  output: {schema: GenerateJobRoadmapOutputSchema},
  prompt: `You are an AI career counselor. Generate a roadmap for the job role: {{{jobRole}}}, tailored to the student's interests: {{{interests}}}. Also suggest relevant resources.

Roadmap: A step-by-step guide to achieving the job role.
Resources: List of helpful books, websites, courses, and other learning materials.
`,
});

const generateJobRoadmapFlow = ai.defineFlow(
  {
    name: 'generateJobRoadmapFlow',
    inputSchema: GenerateJobRoadmapInputSchema,
    outputSchema: GenerateJobRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
