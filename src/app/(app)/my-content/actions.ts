
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
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
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
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

    const { error } = await supabase.rpc('create_quiz_with_questions', {
        p_mentor_id: user.id,
        p_quiz_title: title,
        p_quiz_topic: topic,
        p_quiz_description: description,
        p_questions_data: questions.map(q => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
        }))
    });

    if (error) {
        console.error("Error creating manual quiz:", error);
        return { success: false, message: `Database error: ${error.message}` };
    }

    revalidatePath('/my-content');
    revalidatePath('/dashboard');
    return { success: true, message: "Manual quiz created successfully!" };
}

const announcementSchema = z.object({
    content: z.string().min(10, "Announcement must be at least 10 characters.").max(500, "Announcement cannot exceed 500 characters."),
});

export type AnnouncementState = {
    success: boolean;
    message: string;
};

export async function createAnnouncementAction(
    prevState: AnnouncementState,
    formData: FormData
): Promise<AnnouncementState> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "You must be logged in to post an announcement." };
    }

    const validatedFields = announcementSchema.safeParse({
        content: formData.get("content"),
    });

    if (!validatedFields.success) {
        return { success: false, message: validatedFields.error.flatten().fieldErrors.content?.[0] || "Invalid input." };
    }

    const { error } = await supabase.from('announcements').insert({
        mentor_id: user.id,
        content: validatedFields.data.content,
    });

    if (error) {
        console.error("Error creating announcement:", error);
        return { success: false, message: `Database error: ${error.message}` };
    }

    revalidatePath('/my-content');
    revalidatePath('/dashboard');
    return { success: true, message: "Announcement posted successfully!" };
}
