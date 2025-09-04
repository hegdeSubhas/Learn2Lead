"use server";

import { generateQuizQuestions, type QuizQuestion } from "@/ai/flows/generate-quiz-questions";
import { quizCategories } from "@/services/quiz";
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

  if (!process.env.GEMINI_API_KEY) {
    const mockQuestions: QuizQuestion[] = [
      { question: "What is the capital of India?", options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"], correctAnswer: "New Delhi" },
      { question: "Which river is considered the holiest in India?", options: ["Yamuna", "Ganges", "Brahmaputra", "Godavari"], correctAnswer: "Ganges" },
      { question: "Who was the first Prime Minister of India?", options: ["Sardar Patel", "Mahatma Gandhi", "Jawaharlal Nehru", "Indira Gandhi"], correctAnswer: "Jawaharlal Nehru" },
      { question: "Which festival is known as the festival of lights in India?", options: ["Holi", "Diwali", "Dussehra", "Navratri"], correctAnswer: "Diwali" },
      { question: "What is the national animal of India?", options: ["Lion", "Tiger", "Elephant", "Leopard"], correctAnswer: "Tiger" },
    ];
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, questions: mockQuestions };
  }

  try {
    const categoryName = quizCategories.find(cat => cat.id === Number(validatedCategory.data))?.name || "General Knowledge";
    const result = await generateQuizQuestions({ category: categoryName });
    return { success: true, questions: result.questions };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      error: `Failed to fetch quiz questions. ${errorMessage}`,
    };
  }
}
