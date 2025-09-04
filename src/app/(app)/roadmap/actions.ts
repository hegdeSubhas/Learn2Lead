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
  error?: any;
  success: boolean;
};

export async function generateRoadmapAction(
  prevState: RoadmapState,
  formData: FormData
): Promise<RoadmapState> {

  if (!process.env.GEMINI_API_KEY) {
    return {
      success: false,
      error: "The Roadmap Generator is not available. Please configure your Gemini API key in the .env file.",
    };
  }

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
    const jobRoles = validatedFields.data.jobRole.split(',').map(role => role.trim()).filter(role => role.length > 0);
    
    if (jobRoles.length === 0) {
        return {
            success: false,
            error: { jobRole: ["Please enter at least one valid job role."] }
        }
    }

    const result = await generateJobRoadmap({
      jobRoles: jobRoles,
      interests: validatedFields.data.interests,
    });
    return { success: true, result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate roadmap. Please try again." };
  }
}
