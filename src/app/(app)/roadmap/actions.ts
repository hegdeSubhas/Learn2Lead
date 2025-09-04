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

  const jobRoles = validatedFields.data.jobRole.split(',').map(role => role.trim()).filter(role => role.length > 0);
    
  if (jobRoles.length === 0) {
      return {
          success: false,
          error: { jobRole: ["Please enter at least one valid job role."] }
      }
  }

  if (!process.env.GEMINI_API_KEY) {
    const mockRoadmap = `This is a mock response because the Gemini API key is not configured. The following is a sample roadmap for a **Software Engineer** interested in **Web Development**.

### Phase 1: Foundational Skills (0-3 Months)
*   **Master HTML, CSS, and JavaScript:** These are the absolute fundamentals.
    *   Build 5 simple static websites.
    *   Learn about responsive design using Flexbox and CSS Grid.
*   **Learn Git and GitHub:** Version control is essential for collaboration.
    *   Create a GitHub profile and push all your projects there.

### Phase 2: Frontend Specialization (3-6 Months)
*   **Choose a JavaScript Framework:** Pick one and stick with it. React is a popular choice.
    *   Complete a comprehensive course on React.
    *   Build a small web application, like a to-do list or a weather app.
*   **Learn about APIs:** Understand how to fetch data from a backend service.

### Phase 3: Backend Development (6-9 Months)
*   **Learn a Backend Language and Framework:** Node.js with Express is a great choice for JavaScript developers.
    *   Build a simple REST API for your frontend application.
*   **Understand Databases:** Learn the basics of SQL (e.g., PostgreSQL) or NoSQL (e.g., MongoDB).

### Phase 4: Full-Stack and Deployment (9-12+ Months)
*   **Build a Full-Stack Project:** Create a complete application with a frontend, backend, and database. This will be your main portfolio piece.
*   **Learn to Deploy:** Understand how to get your application live on the internet using services like Vercel, Netlify, or AWS.`;

    const mockResources = `### Books
*   "Eloquent JavaScript" by Marijn Haverbeke
*   "You Don't Know JS" series by Kyle Simpson

### Online Courses
*   **freeCodeCamp:** Comprehensive curriculum for web development.
*   **The Odin Project:** A full-stack, project-based curriculum.
*   **Coursera/Udemy:** Search for courses on React, Node.js, and other specific technologies.

### Communities
*   **Stack Overflow:** For asking technical questions.
*   **Dev.to:** A community of developers sharing articles and tutorials.`;

    // Simulate a delay to mimic API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true, result: { roadmap: mockRoadmap, resources: mockResources } };
  }
  
  try {
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
