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
    const mockRoadmap = `<h3>Phase 1: Foundational Skills (0-3 Months)</h3>
<ul>
    <li><strong>Master HTML, CSS, and JavaScript:</strong> These are the absolute fundamentals.
        <ul>
            <li>Build 5 simple static websites.</li>
            <li>Learn about responsive design using Flexbox and CSS Grid.</li>
        </ul>
    </li>
    <li><strong>Learn Git and GitHub:</strong> Version control is essential for collaboration.
        <ul>
            <li>Create a GitHub profile and push all your projects there.</li>
        </ul>
    </li>
</ul>
<h3>Phase 2: Frontend Specialization (3-6 Months)</h3>
<ul>
    <li><strong>Choose a JavaScript Framework:</strong> Pick one and stick with it. React is a popular choice.
        <ul>
            <li>Complete a comprehensive course on React.</li>
            <li>Build a small web application, like a to-do list or a weather app.</li>
        </ul>
    </li>
    <li><strong>Learn about APIs:</strong> Understand how to fetch data from a backend service.</li>
</ul>
<h3>Phase 3: Backend Development (6-9 Months)</h3>
<ul>
    <li><strong>Learn a Backend Language and Framework:</strong> Node.js with Express is a great choice for JavaScript developers.
        <ul>
            <li>Build a simple REST API for your frontend application.</li>
        </ul>
    </li>
    <li><strong>Understand Databases:</strong> Learn the basics of SQL (e.g., PostgreSQL) or NoSQL (e.g., MongoDB).</li>
</ul>
<h3>Phase 4: Full-Stack and Deployment (9-12+ Months)</h3>
<ul>
    <li><strong>Build a Full-Stack Project:</strong> Create a complete application with a frontend, backend, and database. This will be your main portfolio piece.</li>
    <li><strong>Learn to Deploy:</strong> Understand how to get your application live on the internet using services like Vercel, Netlify, or AWS.</li>
</ul>`;

    const mockResources = `<h3>Books</h3>
<ul>
    <li>"Eloquent JavaScript" by Marijn Haverbeke</li>
    <li>"You Don't Know JS" series by Kyle Simpson</li>
</ul>
<h3>Online Courses</h3>
<ul>
    <li><strong>freeCodeCamp:</strong> Comprehensive curriculum for web development.</li>
    <li><strong>The Odin Project:</strong> A full-stack, project-based curriculum.</li>
    <li><strong>Coursera/Udemy:</strong> Search for courses on React, Node.js, and other specific technologies.</li>
</ul>
<h3>Communities</h3>
<ul>
    <li><strong>Stack Overflow:</strong> For asking technical questions.</li>
    <li><strong>Dev.to:</strong> A community of developers sharing articles and tutorials.</li>
</ul>`;

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
