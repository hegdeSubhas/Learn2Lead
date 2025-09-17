
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
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors[Object.keys(validatedFields.error.flatten().fieldErrors)[0]][0],
    };
  }

  const {
      name,
      email,
      password,
      phone,
      age,
      education,
      skills,
      hobbies,
      ambition
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

  const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      full_name: name,
      phone,
      age,
      education,
      skills,
      hobbies,
      ambition,
  });

  if (profileError) {
      // Potentially delete the user if profile creation fails
      const { data, error } = await supabase.auth.admin.deleteUser(authData.user.id);
      if (error) {
        return { success: false, message: `Could not create profile and failed to clean up user: ${error.message}. Please contact support.` };
      }
      return { success: false, message: `Could not create profile: ${profileError.message}` };
  }

  return { 
      success: true,
      message: "Signup successful! Please check your email to verify your account."
  };
}
