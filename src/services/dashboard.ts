
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface DashboardQuiz {
  id: number;
  title: string;
  topic: string | null;
  mentor_name: string | null;
}

export interface DashboardAnnouncement {
  id: number;
  content: string;
  created_at: string;
  mentor_name: string | null;
}

type Profile = { full_name: string | null };

async function getConnectedMentorIds(supabase: SupabaseClient, studentId: string): Promise<string[]> {
    const { data: requests, error } = await supabase
        .from('mentor_requests')
        .select('mentor_id')
        .eq('student_id', studentId)
        .eq('status', 'accepted');
    
    if (error) {
        console.error("Error fetching mentor connections:", error);
        return [];
    }
    return requests.map(r => r.mentor_id);
}

export async function getQuizzesForDashboard(studentId: string): Promise<{ data: DashboardQuiz[] | null, error: string | null }> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const mentorIds = await getConnectedMentorIds(supabase, studentId);

    if (mentorIds.length === 0) {
        return { data: [], error: null };
    }

    // Check if a quiz submission exists for the user and quiz
    const { data: quizzes, error } = await supabase
        .from('mentor_quizzes')
        .select(`
            id, 
            title, 
            topic,
            mentor:profiles (full_name)
        `)
        .in('mentor_id', mentorIds)
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching quizzes for dashboard:", error);
        return { data: null, error: "Failed to fetch quizzes." };
    }

    const formattedQuizzes = quizzes.map(q => {
        const mentorProfile = q.mentor as Profile | Profile[] | null;
        const profile = Array.isArray(mentorProfile) ? mentorProfile[0] : mentorProfile;
        return {
            id: q.id,
            title: q.title,
            topic: q.topic,
            mentor_name: profile?.full_name || 'N/A'
        }
    });

    return { data: formattedQuizzes, error: null };
}

export async function getAnnouncementsForDashboard(studentId: string): Promise<{ data: DashboardAnnouncement[] | null, error: string | null }> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const mentorIds = await getConnectedMentorIds(supabase, studentId);

    if (mentorIds.length === 0) {
        return { data: [], error: null };
    }

    const { data, error } = await supabase
        .from('announcements')
        .select(`
            id,
            content,
            created_at,
            mentor:profiles (full_name)
        `)
        .in('mentor_id', mentorIds)
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching announcements for dashboard:", error);
        return { data: null, error: "Failed to fetch announcements." };
    }

    const announcements = data.map(a => {
        const mentorProfile = a.mentor as Profile | Profile[] | null;
        const profile = Array.isArray(mentorProfile) ? mentorProfile[0] : mentorProfile;
        return {
            id: a.id,
            content: a.content,
            created_at: a.created_at,
            mentor_name: profile?.full_name || 'N'
        }
    });

    return { data: announcements, error: null };
}
