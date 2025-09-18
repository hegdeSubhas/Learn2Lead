
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type RequestState = {
  success: boolean;
  message: string;
};

const updateRequestSchema = z.object({
  requestId: z.coerce.number(),
  status: z.enum(['accepted', 'rejected']),
});

export async function updateRequestAction(
  prevState: RequestState,
  formData: FormData
): Promise<RequestState> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in." };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'mentor') {
    return { success: false, message: "Only mentors can perform this action." };
  }

  const validatedFields = updateRequestSchema.safeParse({
    requestId: formData.get("requestId"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return { success: false, message: "Invalid data submitted." };
  }
  
  const { requestId, status } = validatedFields.data;

  const { error } = await supabase
    .from('mentor_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', requestId)
    .eq('mentor_id', user.id); // Security check: ensure mentor owns this request

  if (error) {
    console.error("Error updating request:", error);
    return { success: false, message: `Failed to update request: ${error.message}` };
  }

  revalidatePath('/requests');
  return {
    success: true,
    message: `Request has been successfully ${status}.`,
  };
}
