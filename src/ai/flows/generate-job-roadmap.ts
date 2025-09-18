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
  jobRoles: z.array(z.string()).describe('The specific job roles for which to generate a roadmap. This may include abbreviations or typos.'),
  interests: z.string().describe('The interests of the student to tailor the roadmap.'),
});
export type GenerateJobRoadmapInput = z.infer<typeof GenerateJobRoadmapInputSchema>;

const GenerateJobRoadmapOutputSchema = z.object({
  roadmap: z.string().describe('The generated roadmap in HTML format.'),
  resources: z.string().describe('Suggested resources in HTML format.'),
});
export type GenerateJobRoadmapOutput = z.infer<typeof GenerateJobRoadmapOutputSchema>;

export async function generateJobRoadmap(input: GenerateJobRoadmapInput): Promise<GenerateJobRoadmapOutput> {
  return generateJobRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJobRoadmapPrompt',
  input: {schema: GenerateJobRoadmapInputSchema},
  output: {schema: GenerateJobRoadmapOutputSchema},
  prompt: `You are an expert AI career counselor. Your task is to generate a detailed, step-by-step career roadmap for a student.

You will be given one or more target job roles and the student's personal interests.

First, interpret the user's input for job roles in a case-insensitive manner. The input may contain abbreviations, typos, or variations (e.g., 'ai' or 'A.I.' for 'Artificial Intelligence', 'ML' for 'Machine Learning', 'frontend dev' for 'Frontend Developer'). Identify the most likely, standard job titles from the input before proceeding.

Generate a combined roadmap for the interpreted job roles based on this input: {{#each jobRoles}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.

The roadmap must be tailored to the student's specific interests: {{{interests}}}.

The output should be structured into two parts: a "Roadmap" and "Resources".

Roadmap: Provide a clear, actionable, step-by-step guide. Include milestones such as:
- Foundational knowledge (e.g., key subjects, programming languages).
- Intermediate skills (e.g., specific frameworks, tools, or specializations).
- Advanced topics and portfolio-building projects.
- Networking and job application strategies.
Format this section using rich HTML with headings, lists, bold text, and other appropriate tags for clarity.

Resources: Suggest a curated list of high-quality learning materials. Include a mix of:
- Books (Title and Author).
- Websites and Blogs (e.g., Smashing Magazine, freeCodeCamp).
- Online Courses (e.g., specific courses on Coursera, Udemy, or other platforms).
- Communities (e.g., relevant subreddits, Discord servers).
Format this section as a well-structured HTML list.
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
