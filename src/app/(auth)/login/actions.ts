"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required."),
});

export type LoginState = {
  success: boolean;
  message: string;
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  const { email, password } = validatedFields.data;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }
  
  redirect('/dashboard');
}

export async function logoutAction() {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect('/login');
}
