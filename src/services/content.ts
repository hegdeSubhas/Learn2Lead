
import { createClient } from "@/lib/supabase/server";

export interface MentorQuiz {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
  question_count: number;
}

export async function getMentorQuizzes(mentorId: string): Promise<{ data: MentorQuiz[] | null; error: string | null }> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('mentor_quizzes')
    .select('id, title, description, created_at, mentor_quiz_questions(count)')
    .eq('mentor_id', mentorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching mentor quizzes:", error);
    return { data: null, error: "Failed to fetch your created quizzes. Please ensure your database policies are correct." };
  }
  
  const quizzes = data.map(q => ({
    ...q,
    // @ts-ignore
    question_count: q.mentor_quiz_questions[0]?.count || 0
  }));


  return { data: quizzes, error: null };
}
