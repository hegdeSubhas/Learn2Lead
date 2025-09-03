"use server";

import { generateJobRoadmap } from "@/ai/flows/generate-job-roadmap";
import { z } from "zod";

const roadmapSchema = z.object({
  jobRole: z.string().min(3, "Job role must be at least 3 characters long."),
  interests: z.string().min(10, "Interests must be at least 10 characters long."),
});

export type RoadmapState = {
  result?: {
    roadmap: string;
    resources: string;
  };
  error?: string;
  success: boolean;
};

export async function generateRoadmapAction(
  prevState: RoadmapState,
  formData: FormData
): Promise<RoadmapState> {
  const validatedFields = roadmapSchema.safeParse({
    jobRole: formData.get("jobRole"),
    interests: formData.get("interests"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const result = await generateJobRoadmap({
      jobRole: validatedFields.data.jobRole,
      interests: validatedFields.data.interests,
    });
    return { success: true, result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate roadmap. Please try again." };
  }
}
