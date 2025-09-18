
"use server";

import { generateQuizQuestions } from "@/ai/flows/generate-quiz-questions";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createQuizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().optional(),
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  numQuestions: z.coerce.number().min(1).max(20),
});

export type CreateQuizState = {
  success: boolean;
  message: string;
};

export async function createQuizAction(
  prevState: CreateQuizState,
  formData: FormData
): Promise<CreateQuizState> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in to create a quiz." };
  }

  const validatedFields = createQuizSchema.safeParse(Object.fromEntries(formData.entries()));

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

  // 2. Insert the quiz into the mentor_quizzes table
  const { data: quizData, error: quizError } = await supabase
    .from('mentor_quizzes')
    .insert({
      mentor_id: user.id,
      title,
      description,
    })
    .select('id')
    .single();

  if (quizError) {
    console.error("Error creating quiz:", quizError);
    return { success: false, message: `Database error: ${quizError.message}` };
  }

  const quizId = quizData.id;

  // 3. Insert the questions into the mentor_quiz_questions table
  const questionInsertData = questions.map(q => ({
    quiz_id: quizId,
    question: q.question,
    options: q.options,
    correct_answer: q.correctAnswer,
  }));

  const { error: questionsError } = await supabase
    .from('mentor_quiz_questions')
    .insert(questionInsertData);

  if (questionsError) {
    console.error("Error inserting questions:", questionsError);
    // Optional: Clean up the created quiz entry if questions fail to insert
    await supabase.from('mentor_quizzes').delete().eq('id', quizId);
    return { success: false, message: `Database error inserting questions: ${questionsError.message}` };
  }

  revalidatePath('/my-content');
  return { success: true, message: "Quiz created successfully!" };
}
