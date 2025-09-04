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

  if (!process.env.GEMINI_API_KEY) {
    // Return mock data if API key is not available
    const mockGuidance = `This is a mock response because the Gemini API key is not configured.

**Potential Career Paths:**

*   **Full-Stack Web Developer:** Given your interest in web development and skills in HTML, CSS, and JavaScript, this is a natural fit. You can build both the user-facing (frontend) and server-side (backend) parts of websites and applications.
*   **Data Scientist / Analyst:** Your background in mathematics and interest in AI make this a strong option. You would work with large datasets to uncover trends, make predictions, and provide insights for businesses.
*   **AI/ML Engineer:** This path directly aligns with your aspiration to work in artificial intelligence. You would focus on designing and building intelligent systems and machine learning models.

**Recommended Skills to Develop:**

*   **For Web Development:**
    *   **JavaScript Frameworks:** Learn a modern framework like React (which this app is built with!), Angular, or Vue.js.
    *   **Backend Technologies:** Gain proficiency in Node.js with Express, or explore other languages like Python with Django/Flask.
    *   **Databases:** Understand both SQL (like PostgreSQL) and NoSQL (like MongoDB) databases.
*   **For Data Science:**
    *   **Python:** Deepen your knowledge, focusing on libraries like Pandas, NumPy, Scikit-learn, and TensorFlow/PyTorch.
    *   **Statistics and Probability:** A strong foundation is crucial for understanding data and models.
    *   **Data Visualization:** Learn tools like Matplotlib, Seaborn, or Tableau to present your findings effectively.

To get the full, personalized experience, please add your Gemini API key to the .env file.`;
    
    // Simulate a delay to mimic API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, result: { guidance: mockGuidance } };
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
