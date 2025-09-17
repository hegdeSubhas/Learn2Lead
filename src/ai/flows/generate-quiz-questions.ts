'use server';

/**
 * @fileOverview A Genkit flow for generating quiz questions for a given category with an Indian context.
 *
 * - generateQuizQuestions - A function that generates a quiz.
 * - GenerateQuizQuestionsInput - The input type for the generateQuizQuestions function.
 * - GenerateQuizQuestionsOutput - The return type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionsInputSchema = z.object({
  category: z.string().describe('The category for which to generate quiz questions.'),
  numberOfQuestions: z.number().optional().default(5).describe('The number of questions to generate.'),
});
export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

const QuizQuestionSchema = z.object({
    question: z.string().describe('The quiz question.'),
    options: z.array(z.string()).describe('An array of 4 multiple choice options.'),
    correctAnswer: z.string().describe('The correct answer from the options.'),
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

const GenerateQuizQuestionsOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe('The generated list of quiz questions.'),
});
export type GenerateQuizQuestionsOutput = z.infer<typeof GenerateQuizQuestionsOutputSchema>;

export async function generateQuizQuestions(input: GenerateQuizQuestionsInput): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: GenerateQuizQuestionsOutputSchema},
  prompt: `You are a quiz master. Generate a list of {{{numberOfQuestions}}} multiple-choice questions for the following category: {{{category}}}.

  IMPORTANT: All questions and answers must be relevant to India.

  Each question should have 4 options and you must specify the correct answer.`,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
