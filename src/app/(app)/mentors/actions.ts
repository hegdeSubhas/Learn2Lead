
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type RequestState = {
  success: boolean;
  message: string;
};

const requestSchema = z.object({
  mentorId: z.string().uuid("Invalid mentor ID."),
});

export async function requestMentorAction(
  prevState: RequestState,
  formData: FormData
): Promise<RequestState> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to send a request.",
    };
  }

  const validatedFields = requestSchema.safeParse({
    mentorId: formData.get("mentorId"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data submitted.",
    };
  }
  
  const { mentorId } = validatedFields.data;

  // Check if a request already exists
  const { data: existingRequest, error: existingError } = await supabase
    .from('mentor_requests')
    .select('id')
    .eq('student_id', user.id)
    .eq('mentor_id', mentorId)
    .maybeSingle();

  if (existingError) {
    console.error('Error checking for existing request:', existingError);
    return { success: false, message: 'Could not process your request. Please try again.' };
  }

  if (existingRequest) {
    return { success: false, message: 'You have already sent a request to this mentor.' };
  }

  // Insert the new request
  const { error } = await supabase.from('mentor_requests').insert({
    student_id: user.id,
    mentor_id: mentorId,
    status: 'pending',
  });

  if (error) {
    console.error("Error creating mentor request:", error);
    return {
      success: false,
      message: `Failed to send request: ${error.message}`,
    };
  }

  revalidatePath('/mentors');
  return {
    success: true,
    message: "Your request has been sent successfully!",
  };
}
