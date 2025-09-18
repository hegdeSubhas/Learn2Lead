
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(['student', 'mentor']),
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
      role,
      phone,
      age,
      education,
      skills,
      hobbies,
      ambition
  } = validatedFields.data;

  const supabase = createClient();

  // 1. Create the user in the auth schema
  const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role,
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
      role,
      phone,
      age,
      education,
      skills,
      hobbies,
      ambition,
      updated_at: new Date().toISOString() 
    });


  if (profileError) {
      console.error("Profile insertion error:", profileError);

      // Check for the specific "table not found" error
      if (profileError.code === '42P01') {
        return {
          success: false,
          message: "Database setup is incomplete. The 'profiles' table was not found or the 'role' column is missing. Please run the required SQL script in your Supabase dashboard's SQL Editor."
        }
      }

       // If profile insertion fails for another reason, we must clean up the created user
       const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
       const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

       // Diagnostic log
       console.log('Attempting cleanup with service role key:', serviceRoleKey ? 'Key Found' : 'Key NOT Found');

       if (!supabaseUrl || !serviceRoleKey) {
            return { success: false, message: "Could not save profile and cleanup failed due to missing server environment variables." };
       }
       
       // THIS REQUIRES a special client that uses the SERVICE_ROLE_KEY
       const { createClient: createAdminClient } = await import('@supabase/supabase-js');
       const supabaseAdmin = createAdminClient(supabaseUrl, serviceRoleKey, {
         auth: {
           autoRefreshToken: false,
           persistSession: false
         }
       });

      const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      if (adminError) {
        return { success: false, message: `Could not save profile and failed to clean up user: ${adminError.message}. Please contact support.` };
      }
       return { success: false, message: `Could not save profile: ${profileError.message}` };
  }

  revalidatePath('/', 'layout');
  
  return { 
      success: true,
      message: "Signup successful! Redirecting to your dashboard..."
  };
}
