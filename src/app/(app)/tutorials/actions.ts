"use server";

import { generateTutorials } from "@/ai/flows/generate-tutorials";
import { z } from "zod";

const tutorialSchema = z.object({
  topic: z.string().min(2, "Topic must be at least 2 characters long."),
  interests: z.string().optional(),
});

export type TutorialState = {
  result?: {
    tutorials: string;
  };
  error?: any;
  success: boolean;
};

export async function generateTutorialsAction(
  prevState: TutorialState,
  formData: FormData
): Promise<TutorialState> {

  const validatedFields = tutorialSchema.safeParse({
    topic: formData.get("topic"),
    interests: formData.get("interests"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  if (!process.env.GEMINI_API_KEY) {
    const mockTutorials = `<h3>React for Beginners</h3>
<ul>
    <li><strong><a href='https://www.youtube.com/watch?v=SqcY0GlETPk' target='_blank' rel='noopener noreferrer'>React JS Full Course for Beginners</a> by Bro Code on YouTube:</strong> A comprehensive video that covers the fundamentals of React from scratch. It's great for visual learners.</li>
    <li><strong><a href='https://react.dev/learn' target='_blank' rel='noopener noreferrer'>Official React Documentation:</a></strong> The best place to start. The new docs are interactive and filled with excellent examples.</li>
    <li><strong><a href='https://www.freecodecamp.org/news/tag/react/' target='_blank' rel='noopener noreferrer'>freeCodeCamp React Articles:</a></strong> A wide range of articles and tutorials on various React concepts.</li>
</ul>

<h3>Project Ideas</h3>
<ul>
    <li>Build a simple To-Do List application.</li>
    <li>Create a basic weather app that fetches data from a free API.</li>
    <li>Develop a personal portfolio website using React.</li>
</ul>`;

    // Simulate a delay to mimic API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true, result: { tutorials: mockTutorials } };
  }
  
  try {
    const result = await generateTutorials({
      topic: validatedFields.data.topic,
      interests: validatedFields.data.interests,
    });
    return { success: true, result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate tutorials. Please try again." };
  }
}
