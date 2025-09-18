
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().optional(),
  age: z.coerce.number().optional(),
  education: z.string().optional(),
  skills: z.string().optional(),
  hobbies: z.string().optional(),
  ambition: z.string().optional(),
});

export type ProfileState = {
  success: boolean;
  message: string;
};

export async function updateUserAction(
  prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      message: "Authentication failed. Please log in again.",
    };
  }

  const validatedFields = profileSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return {
      success: false,
      message: firstError || "Invalid input provided.",
    };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ 
      ...validatedFields.data,
      updated_at: new Date().toISOString() 
    })
    .eq('id', user.id);

  if (error) {
    return { success: false, message: `Failed to update profile: ${error.message}` };
  }

  revalidatePath('/(app)/layout', 'layout');
  revalidatePath('/profile');
  
  return { 
      success: true,
      message: "Your profile has been updated successfully."
  };
}
