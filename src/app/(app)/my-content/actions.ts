
"use server";

import { generateQuizQuestions } from "@/ai/flows/generate-quiz-questions";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const questionSchema = z.object({
  question: z.string().min(1, "Question cannot be empty."),
  options: z.array(z.string().min(1, "Option cannot be empty.")).length(4, "There must be 4 options."),
  correctAnswer: z.string().min(1, "Correct answer must be selected."),
});

const createManualQuizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, "You must add at least one question."),
});

const createAiQuizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().optional(),
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  numQuestions: z.coerce.number().min(1).max(20),
});

export type CreateQuizState = {
  success: boolean;
  message: string;
};

// This is a new, separate action for handling manual quiz creation
export async function createManualQuizAction(
  prevState: CreateQuizState,
  formData: FormData
): Promise<CreateQuizState> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "You must be logged in to create a quiz." };
    }

    // We need to manually construct the object to parse due to nested arrays
    const formValues = {
        title: formData.get('title'),
        description: formData.get('description'),
        questions: Array.from(formData.keys())
            .filter(key => key.startsWith('questions['))
            .reduce((acc, key) => {
                const match = key.match(/questions\[(\d+)\]\.(.+)/);
                if (match) {
                    const index = parseInt(match[1], 10);
                    const field = match[2];
                    if (!acc[index]) acc[index] = { options: [] };

                    if (field.startsWith('options[')) {
                        const optIndex = parseInt(field.match(/options\[(\d+)\]/)?.[1] || '0', 10);
                        acc[index].options[optIndex] = formData.get(key) as string;
                    } else {
                        // @ts-ignore
                        acc[index][field] = formData.get(key);
                    }
                }
                return acc;
            }, [] as any[]).filter(q => q), // filter out empty slots
    };

    const validatedFields = createManualQuizSchema.safeParse(formValues);

    if (!validatedFields.success) {
        const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
        return { success: false, message: firstError || "Invalid input provided." };
    }

    const { title, description, questions } = validatedFields.data;

    // Insert quiz and questions within a transaction
    const { data: quizData, error } = await supabase.rpc('create_quiz_with_questions', {
        mentor_id: user.id,
        quiz_title: title,
        quiz_description: description,
        questions_data: questions.map(q => ({
            question: q.question,
            options: q.options,
            correct_answer: q.correctAnswer,
        }))
    });

    if (error) {
        console.error("Error creating manual quiz:", error);
        return { success: false, message: `Database error: ${error.message}` };
    }

    revalidatePath('/my-content');
    return { success: true, message: "Manual quiz created successfully!" };
}


// Renamed from createQuizAction to be more specific
export async function createAiQuizAction(
  prevState: CreateQuizState,
  formData: FormData
): Promise<CreateQuizState> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in to create a quiz." };
  }

  const validatedFields = createAiQuizSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, message: firstError || "Invalid input provided." };
  }

  const { title, description, topic, numQuestions } = validatedFields.data;

  // 1. Generate questions using Genkit flow
  let questions;
  try {
    const genkitResult = await generateQuizQuestions({
      category: topic,
      numberOfQuestions: numQuestions,
    });
    questions = genkitResult.questions;
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    return { success: false, message: "Failed to generate quiz questions with AI. Please try again." };
  }

  if (!questions || questions.length === 0) {
    return { success: false, message: "The AI could not generate questions for this topic. Try a different one." };
  }

  // 2. Insert quiz and questions using the same RPC function for atomicity
  const { error } = await supabase.rpc('create_quiz_with_questions', {
        mentor_id: user.id,
        quiz_title: title,
        quiz_description: description,
        questions_data: questions.map(q => ({
            question: q.question,
            options: q.options,
            correct_answer: q.correctAnswer,
        }))
    });

  if (error) {
    console.error("Error creating AI quiz:", error);
    return { success: false, message: `Database error: ${error.message}` };
  }

  revalidatePath('/my-content');
  return { success: true, message: "AI-generated quiz created successfully!" };
}
