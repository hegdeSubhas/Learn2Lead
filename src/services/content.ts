
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
  
  const { data, error } = await supabase.rpc('get_mentor_quizzes_with_counts', {
    p_mentor_id: mentorId
  });

  if (error) {
    console.error("Error fetching mentor quizzes:", error);
    return { data: null, error: "Failed to fetch your created quizzes." };
  }
  
  return { data, error: null };
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

    const submissions = data.map(s => {
        // The student profile can be null or an array depending on the relationship.
        // This defensive code handles both cases.
        const profile = Array.isArray(s.student) ? s.student[0] : s.student;
        return {
            id: s.id,
            score: s.score,
            submitted_at: s.submitted_at,
            student_name: profile?.full_name || 'Anonymous'
        };
    });

    return { data: submissions, error: null, quizTitle: quizData.title };
}

export interface Announcement {
    id: number;
    content: string;
    created_at: string;
}

export async function getMentorAnnouncements(mentorId: string): Promise<{ data: Announcement[] | null; error: string | null }> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('announcements')
        .select('id, content, created_at')
        .eq('mentor_id', mentorId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching announcements:", error);
        return { data: null, error: "Failed to fetch announcements." };
    }
    
    return { data, error: null };
}
