'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating learning tutorials based on user interests.
 *
 * It includes:
 * - generateTutorials: The main function to trigger the tutorial generation flow.
 * - GenerateTutorialsInput: The input type for the generateTutorials function.
 * - GenerateTutorialsOutput: The output type for the generateTutorials function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTutorialsInputSchema = z.object({
  topic: z.string().describe('The topic or skill the user wants to learn.'),
  interests: z.string().optional().describe('The optional interests of the student to tailor the suggestions (e.g., "I prefer video content").'),
});
export type GenerateTutorialsInput = z.infer<typeof GenerateTutorialsInputSchema>;

const GenerateTutorialsOutputSchema = z.object({
  tutorials: z.string().describe('The generated list of tutorials and resources in HTML format.'),
});
export type GenerateTutorialsOutput = z.infer<typeof GenerateTutorialsOutputSchema>;

export async function generateTutorials(input: GenerateTutorialsInput): Promise<GenerateTutorialsOutput> {
  return generateTutorialsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTutorialsPrompt',
  input: {schema: GenerateTutorialsInputSchema},
  output: {schema: GenerateTutorialsOutputSchema},
  prompt: `You are an expert AI learning consultant. Your task is to generate a curated list of learning resources for a student.

You will be given a target topic/skill and the student's optional personal interests.

Generate a list of learning resources for the following topic: {{{topic}}}.

If provided, tailor the suggestions to the student's specific interests: {{{interests}}}.

The output should be a list of high-quality learning materials. Include a mix of:
- YouTube Videos (Title and Link).
- Official Documentation or Websites (Name and Link).
- Online Courses (e.g., specific courses on Coursera, Udemy, or free platforms).
- Articles or Blogs.
- Simple project ideas to practice the skill.

Format this section using rich HTML with headings, lists, bold text, and hyperlinks for clarity. Ensure all links are clickable (using <a> tags with target="_blank").
`,
});

const generateTutorialsFlow = ai.defineFlow(
  {
    name: 'generateTutorialsFlow',
    inputSchema: GenerateTutorialsInputSchema,
    outputSchema: GenerateTutorialsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
