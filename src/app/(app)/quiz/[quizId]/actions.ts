
"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export type QuizQuestion = {
    id: number;
    question: string;
    options: string[];
    correct_answer: string;
};

export type QuizWithQuestions = {
    id: number;
    title: string;
    description: string | null;
    topic: string | null;
    questions: QuizQuestion[];
};

type SubmissionState = {
    success: boolean;
    data?: {
        score: number;
        total: number;
        review: any[];
    };
    error?: string;
};

const submissionSchema = z.object({
  quizId: z.number(),
  answers: z.record(z.string()),
});

export async function submitQuizAction(input: { quizId: number; answers: Record<string, string>}): Promise<SubmissionState> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "You must be logged in to submit a quiz." };
    }

    const validatedInput = submissionSchema.safeParse(input);

    if (!validatedInput.success) {
        return { success: false, error: "Invalid submission data." };
    }

    const { quizId, answers } = validatedInput.data;

    // Fetch the quiz with correct answers to verify and score
    const { data: quizData, error: quizError } = await supabase
        .from('mentor_quizzes')
        .select(`
            mentor_id,
            questions:mentor_quiz_questions (
                id,
                question,
                correct_answer
            )
        `)
        .eq('id', quizId)
        .single();
    
    if (quizError || !quizData) {
        return { success: false, error: "Could not retrieve quiz for evaluation." };
    }

    // Calculate score
    let score = 0;
    const reviewData = quizData.questions.map((q, index) => {
        const studentAnswer = answers[index];
        const isCorrect = studentAnswer === q.correct_answer;
        if (isCorrect) {
            score++;
        }
        return {
            question: q.question,
            yourAnswer: studentAnswer,
            correctAnswer: q.correct_answer,
            isCorrect,
        };
    });
    
    // Save submission to the database
    const { error: submissionError } = await supabase
        .from('quiz_submissions')
        .insert({
            quiz_id: quizId,
            student_id: user.id,
            mentor_id: quizData.mentor_id,
            score: score,
            answers: answers as any, // Cast to any to satisfy Supabase type
        });
    
    if (submissionError) {
        console.error("Error saving submission:", submissionError);
        return { success: false, error: "There was an error saving your results. Please try again." };
    }
    
    revalidatePath(`/quiz/${quizId}`);

    return {
        success: true,
        data: {
            score,
            total: quizData.questions.length,
            review: reviewData,
        }
    };
}
