
"use server";

import { getAIMentorGuidance } from "@/ai/flows/ai-mentor-guidance";
import { createClient } from "@/lib/supabase/server";
import type { Message } from "./types";

export type MentorState = {
  result?: {
    guidance: string;
  };
  messages?: Message[];
  error?: any;
  success: boolean;
};

// This function now handles a full conversation
export async function getGuidanceAction(
  prevState: MentorState,
  formData: FormData
): Promise<MentorState> {
  
  const userInput = formData.get("userInput") as string;
  const pastMessagesRaw = formData.get("messages") as string;

  if (!userInput || userInput.trim().length === 0) {
    return {
      ...prevState,
      success: false,
      error: "Please enter a message.",
    };
  }

  let pastMessages: Message[] = [];
  try {
    pastMessages = JSON.parse(pastMessagesRaw);
  } catch (e) {
    return {
      ...prevState,
      success: false,
      error: "Invalid message history.",
    };
  }

  const allMessages: Message[] = [...pastMessages, { role: 'user', content: userInput }];

  if (!process.env.GEMINI_API_KEY) {
    // Return mock data if API key is not available
    const mockGuidance = "This is a mock response because the Gemini API key is not configured. I am a helpful AI assistant ready to provide guidance on careers, skills, and learning paths. Ask me anything!";
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { 
        success: true, 
        messages: [...allMessages, { role: 'assistant', content: mockGuidance }]
    };
  }

  // Fetch user profile for context
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let userProfileString = "";
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (profile) {
        userProfileString = `
            Role: ${profile.role || 'student'}
            Name: ${profile.full_name || 'N/A'}
            Education: ${profile.education || 'N/A'}
            Skills: ${profile.skills || 'N/A'}
            Hobbies: ${profile.hobbies || 'N/A'}
            Ambition: ${profile.ambition || 'N/A'}
        `;
    }
  }

  try {
    const result = await getAIMentorGuidance({
      messages: allMessages,
      userProfile: userProfileString,
    });
    
    const newAssistantMessage: Message = {
        role: 'assistant',
        content: result.guidance,
    };

    return { success: true, messages: [...allMessages, newAssistantMessage] };

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { 
        ...prevState,
        success: false, 
        error: `Failed to get guidance. ${errorMessage}` 
    };
  }
}
