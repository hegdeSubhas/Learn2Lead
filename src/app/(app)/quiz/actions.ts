"use server";

import { getQuizQuestionsFromApi, type QuizQuestion } from "@/services/quiz";
import { z } from "zod";

export type { QuizQuestion };

type QuizState = {
  questions?: QuizQuestion[];
  error?: string;
  success: boolean;
};

export async function getQuizAction(categoryId: string): Promise<QuizState> {
  const validatedCategory = z.string().min(1).safeParse(categoryId);

  if (!validatedCategory.success) {
    return {
      success: false,
      error: "Invalid category provided.",
    };
  }

  try {
    const questions = await getQuizQuestionsFromApi(Number(validatedCategory.data));
    return { success: true, questions };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      error: `Failed to fetch quiz questions. ${errorMessage}`,
    };
  }
}
