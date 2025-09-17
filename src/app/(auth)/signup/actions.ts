
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

  // 1. Create the user in the auth schema
  const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // You can pass metadata here, but it's often easier to handle it in the profile
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

  // 2. Insert the complete profile into the public.profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ 
      id: authData.user.id,
      full_name: name,
      phone: profileData.phone,
      age: profileData.age,
      education: profileData.education,
      skills: profileData.skills,
      hobbies: profileData.hobbies,
      ambition: profileData.ambition,
      updated_at: new Date().toISOString() 
    });


  if (profileError) {
      console.error("Profile insertion error:", profileError);
       // If profile insertion fails, we should try to clean up the created user
      const { data: adminData, error: adminError } = await supabase.auth.admin.deleteUser(authData.user.id)
      if (adminError) {
        return { success: false, message: `Could not save profile and failed to clean up user: ${adminError.message}. Please contact support.` };
      }
       return { success: false, message: `Could not save profile: ${profileError.message}` };
  }

  return { 
      success: true,
      message: "Signup successful! Please check your email to verify your account."
  };
}
