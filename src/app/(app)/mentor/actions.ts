"use server";

import { getAIMentorGuidance } from "@/ai/flows/ai-mentor-guidance";
import { z } from "zod";

const mentorSchema = z.object({
  studentProfile: z.string().min(20, "Profile must be at least 20 characters long."),
  specificQuestion: z.string().optional(),
});

export type MentorState = {
  result?: {
    guidance: string;
  };
  error?: any;
  success: boolean;
};

export async function getGuidanceAction(
  prevState: MentorState,
  formData: FormData
): Promise<MentorState> {
  if (!process.env.GEMINI_API_KEY) {
    return {
      success: false,
      error: "The AI Mentor is not available. Please configure your Gemini API key in the .env file.",
    };
  }

  const validatedFields = mentorSchema.safeParse({
    studentProfile: formData.get("studentProfile"),
    specificQuestion: formData.get("specificQuestion"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await getAIMentorGuidance({
      studentProfile: validatedFields.data.studentProfile,
      specificQuestion: validatedFields.data.specificQuestion,
    });
    return { success: true, result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to get guidance. Please try again." };
  }
}
