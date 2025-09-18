
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export type MentorQuiz = {
  id: number;
  title: string;
  topic: string | null;
  mentor_name: string | null;
}

export const quizCategories = [
    { id: 1, name: 'General Knowledge' },
    { id: 2, name: 'Indian History' },
    { id: 3, name: 'Indian Geography' },
    { id: 4, name: 'Science & Technology' },
    { id: 5, name: 'Sports' },
    { id: 6, name: 'Mathematics' },
    { id: 7, name: 'Computer Science' },
];


export async function getMentorQuizzesForStudent(studentId: string): Promise<{ data: MentorQuiz[] | null; error: string | null }> {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  
  // Find mentors the student is connected to (status = 'accepted')
  const { data: requests, error: requestError } = await supabase
    .from('mentor_requests')
    .select('mentor_id')
    .eq('student_id', studentId)
    .eq('status', 'accepted');

  if (requestError) {
    console.error("Error fetching mentor connections:", requestError);
    return { data: null, error: "Failed to fetch mentor connections." };
  }

  if (!requests || requests.length === 0) {
    return { data: [], error: null }; // No connected mentors
  }

  const mentorIds = requests.map(r => r.mentor_id);

  // Fetch quizzes from those mentors
  const { data: quizzes, error: quizError } = await supabase
    .from('mentor_quizzes')
    .select(`
        id, 
        title, 
        topic,
        mentor:profiles!mentor_quizzes_mentor_id_fkey (
            full_name
        )
    `)
    .in('mentor_id', mentorIds);
  
  if (quizError) {
    console.error("Error fetching mentor quizzes:", quizError);
    return { data: null, error: "Failed to fetch quizzes from your mentors." };
  }

  const formattedQuizzes = quizzes?.map(q => ({
    id: q.id,
    title: q.title,
    topic: q.topic,
    // @ts-ignore
    mentor_name: q.mentor?.full_name || 'N/A'
  })) || [];

  return { data: formattedQuizzes, error: null };
}

export type QuizQuestion = {
    id: number;
    question: string;
    options: string[];
    correct_answer: string;
};

export type QuizWithQuestions = {
    id: number;
    title: string;
    description: string | null;
    topic: string | null;
    questions: QuizQuestion[];
};


export async function getQuizForStudent(quizId: number, studentId: string): Promise<{ data: QuizWithQuestions | null; error: string | null }> {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);

    // First, verify the student has access to this quiz through an accepted mentor
    const { data: quizMeta, error: metaError } = await supabase
        .from('mentor_quizzes')
        .select('id, mentor_id')
        .eq('id', quizId)
        .single();
    
    if (metaError || !quizMeta) {
        return { data: null, error: "Quiz not found." };
    }

    const { count, error: accessError } = await supabase
        .from('mentor_requests')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', studentId)
        .eq('mentor_id', quizMeta.mentor_id)
        .eq('status', 'accepted');

    if (accessError || count === 0) {
        return { data: null, error: "You do not have permission to take this quiz." };
    }

    // Now fetch the full quiz data
    const { data, error } = await supabase
        .from('mentor_quizzes')
        .select(`
            id,
            title,
            description,
            topic,
            questions:mentor_quiz_questions (
                id,
                question,
                options,
                correct_answer
            )
        `)
        .eq('id', quizId)
        .single();

    if (error) {
        console.error("Error fetching quiz with questions:", error);
        return { data: null, error: "Failed to load the quiz details." };
    }

    // Supabase returns 'options' as a JSON string, so we need to parse it
    const formattedQuestions = data.questions.map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options || '[]')
    }));

    return { data: { ...data, questions: formattedQuestions }, error: null };
}
