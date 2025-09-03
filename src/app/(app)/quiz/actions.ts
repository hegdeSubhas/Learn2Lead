'use server';

import { generateQuizQuestions } from '@/ai/flows/generate-quiz-questions';
import { z } from 'zod';

const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.string(),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

type QuizState = {
  questions?: QuizQuestion[];
  error?: string;
  success: boolean;
};

export async function getQuizAction(category: string): Promise<QuizState> {
  const validatedCategory = z.string().min(2).safeParse(category);

  if (!validatedCategory.success) {
    return {
      success: false,
      error: 'Invalid category provided.',
    };
  }

  try {
    const result = await generateQuizQuestions({
      category: validatedCategory.data,
    });
    return { success: true, questions: result.questions };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to generate quiz. Please try again.',
    };
  }
}
