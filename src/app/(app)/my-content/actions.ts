
"use server";

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
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, "You must add at least one question."),
});

export type CreateQuizState = {
  success: boolean;
  message: string;
};

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
        topic: formData.get('topic'),
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

    const { title, description, topic, questions } = validatedFields.data;

    // Insert quiz and questions within a transaction
    const { error } = await supabase.rpc('create_quiz_with_questions', {
        mentor_id: user.id,
        quiz_title: title,
        quiz_description: description,
        quiz_topic: topic,
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
