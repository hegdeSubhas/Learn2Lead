
import { createClient } from "@/lib/supabase/server";

export interface MentorQuiz {
  id: number;
  title: string;
  topic: string | null;
  description: string | null;
  created_at: string;
  question_count: number;
  submission_count: number;
}

export async function getMentorQuizzes(mentorId: string): Promise<{ data: MentorQuiz[] | null; error: string | null }> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('mentor_quizzes')
    .select(`
        id, 
        title, 
        topic, 
        description, 
        created_at, 
        mentor_quiz_questions(count),
        quiz_submissions(count)
    `)
    .eq('mentor_id', mentorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching mentor quizzes:", error);
    return { data: null, error: "Failed to fetch your created quizzes." };
  }
  
  const quizzes = data.map(q => ({
    ...q,
    // @ts-ignore
    question_count: q.mentor_quiz_questions[0]?.count || 0,
    // @ts-ignore
    submission_count: q.quiz_submissions[0]?.count || 0,
  }));

  return { data: quizzes, error: null };
}


export interface QuizSubmission {
    id: number;
    score: number;
    submitted_at: string;
    student_name: string | null;
}

export async function getQuizSubmissions(quizId: number, mentorId: string): Promise<{ data: QuizSubmission[] | null; error: string | null; quizTitle: string | null }> {
    const supabase = createClient();

    // Verify mentor owns the quiz
    const { data: quizData, error: quizError } = await supabase
        .from('mentor_quizzes')
        .select('title, mentor_id')
        .eq('id', quizId)
        .single();
    
    if (quizError || !quizData) {
        return { data: null, error: "Quiz not found.", quizTitle: null };
    }

    if (quizData.mentor_id !== mentorId) {
        return { data: null, error: "You are not authorized to view these submissions.", quizTitle: null };
    }

    const { data, error } = await supabase
        .from('quiz_submissions')
        .select(`
            id,
            score,
            submitted_at,
            student:profiles (
                full_name
            )
        `)
        .eq('quiz_id', quizId)
        .order('submitted_at', { ascending: false });
    
    if (error) {
        console.error("Error fetching submissions:", error);
        return { data: null, error: "Failed to fetch submissions.", quizTitle: quizData.title };
    }

    const submissions = data.map(s => ({
        id: s.id,
        score: s.score,
        submitted_at: s.submitted_at,
        // @ts-ignore
        student_name: s.student?.full_name || 'Anonymous'
    }));

    return { data: submissions, error: null, quizTitle: quizData.title };
}

