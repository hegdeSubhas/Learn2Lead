'use server';

/**
 * @fileOverview An AI chatbot that provides personalized guidance to students based on their conversation history.
 *
 * - getAIMentorGuidance - A function that generates personalized career and skill guidance.
 * - AIMentorGuidanceInput - The input type for the getAIMentorGuidance function.
 * - AIMentorGuidanceOutput - The return type for the getAIMentorGuidance function.
 */

import {ai} from '@/ai/genkit';
import {googleSearch} from '@/ai/tools/search';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const AIMentorGuidanceInputSchema = z.object({
  messages: z.array(MessageSchema).describe('The history of the conversation so far.'),
  studentProfile: z
    .string()
    .optional()
    .describe('A detailed profile of the student, including their interests, skills, academic background, and career aspirations. This is provided for context.'),
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
  tools: [googleSearch],
  prompt: `You are an AI mentor providing personalized guidance to students. Your name is 'Learn2Lead Assistant'.

  You are having a conversation with a student. Keep your responses concise and conversational.
  
  IMPORTANT: If the user's message is in Kannada, you MUST respond in Kannada. Otherwise, respond in English.
  
  If the user asks about careers, skills, or any topic that requires up-to-date information, use the provided search tool.

  Analyze the conversation history to understand the context.

  {{#if studentProfile}}
  Here is the student's profile for additional context:
  {{{studentProfile}}}
  {{/if}}
  
  Conversation History:
  {{#each messages}}
    {{role}}: {{{content}}}
  {{/each}}
  
  Assistant Response:`,
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
