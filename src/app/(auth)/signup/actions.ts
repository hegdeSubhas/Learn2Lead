
"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  phone: z.string().optional(),
  age: z.coerce.number().optional(),
  education: z.string().optional(),
  skills: z.string().optional(),
  hobbies: z.string().optional(),
  ambition: z.string().optional(),
});

export type SignupState = {
  success: boolean;
  message: string;
};

export async function signupAction(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const validatedFields = signupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return {
      success: false,
      message: firstError || "Invalid input provided.",
    };
  }
  
  const {
      name,
      email,
      password,
      ...profileData
  } = validatedFields.data;

  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
            full_name: name,
        }
      }
  });

  if (authError) {
      return { success: false, message: authError.message };
  }

  if (!authData.user) {
      return { success: false, message: "Signup failed, please try again." };
  }

  // The trigger 'handle_new_user' will have already created a profile row.
  // Now, we update that row with the additional data from the form.
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
      ...profileData,
      full_name: name, // also update full_name here
      updated_at: new Date().toISOString() 
    })
    .eq('id', authData.user.id);


  if (profileError) {
      console.error("Profile update error:", profileError);
      // Even if the profile update fails, the user was created.
      // We should inform the user about the success of account creation.
      // The profile can be updated later.
      // Let's return a success message but log the profile error.
       return { success: false, message: `Could not update profile: ${profileError.message}` };
  }

  return { 
      success: true,
      message: "Signup successful! Please check your email to verify your account."
  };
}
