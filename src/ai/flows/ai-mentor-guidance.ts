'use server';

/**
 * @fileOverview An AI mentor that provides personalized guidance to students based on their profile and interests.
 *
 * - getAIMentorGuidance - A function that generates personalized career and skill guidance.
 * - AIMentorGuidanceInput - The input type for the getAIMentorGuidance function.
 * - AIMentorGuidanceOutput - The return type for the getAIMentorGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIMentorGuidanceInputSchema = z.object({
  studentProfile: z
    .string()
    .describe('A detailed profile of the student, including their interests, skills, academic background, and career aspirations.'),
  specificQuestion: z
    .string()
    .optional()
    .describe('A specific question the student has about career paths or required skills.'),
});
export type AIMentorGuidanceInput = z.infer<typeof AIMentorGuidanceInputSchema>;

const AIMentorGuidanceOutputSchema = z.object({
  guidance: z
    .string()
    .describe('Personalized guidance for the student, including potential career paths and necessary skills.'),
});
export type AIMentorGuidanceOutput = z.infer<typeof AIMentorGuidanceOutputSchema>;

export async function getAIMentorGuidance(input: AIMentorGuidanceInput): Promise<AIMentorGuidanceOutput> {
  return aiMentorGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMentorGuidancePrompt',
  input: {schema: AIMentorGuidanceInputSchema},
  output: {schema: AIMentorGuidanceOutputSchema},
  prompt: `You are an AI mentor providing personalized guidance to students.

  Based on the student's profile and any specific questions they have, offer guidance on potential career paths and the skills they'll need.

  Student Profile: {{{studentProfile}}}

  Specific Question: {{{specificQuestion}}}

  Guidance:`,
});

const aiMentorGuidanceFlow = ai.defineFlow(
  {
    name: 'aiMentorGuidanceFlow',
    inputSchema: AIMentorGuidanceInputSchema,
    outputSchema: AIMentorGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
