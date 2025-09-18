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
  userProfile: z
    .string()
    .optional()
    .describe('A detailed profile of the user, including their role (student or mentor), interests, skills, and background. This is provided for context.'),
});
export type AIMentorGuidanceInput = z.infer<typeof AIMentorGuidanceInputSchema>;

const AIMentorGuidanceOutputSchema = z.object({
  guidance: z
    .string()
    .describe('Personalized guidance for the user, tailored to their role.'),
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
  prompt: `You are an AI assistant for the Learn2Lead platform. Your name is 'Learn2Lead Assistant'.

You are having a conversation with a user. Analyze their profile, especially their role, to provide the most relevant assistance. Keep your responses concise and conversational.

IMPORTANT: If the user's message is in Kannada, you MUST respond in Kannada. Otherwise, respond in English.
If you need up-to-date information, use the provided search tool.

---
USER CONTEXT:
{{#if userProfile}}
Here is the user's profile:
{{{userProfile}}}

Based on their 'role', tailor your responses:
- If the role is 'student', act as a friendly AI Mentor. Provide guidance on career paths, learning resources, skill development, and answer their academic questions.
- If the role is 'mentor', act as a helpful teaching assistant. Help them brainstorm quiz questions, generate ideas for lesson plans, structure course content, and suggest teaching strategies.
{{else}}
You do not have the user's profile. Assume they are a student and provide general career and learning guidance.
{{/if}}
---

CONVERSATION HISTORY:
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
